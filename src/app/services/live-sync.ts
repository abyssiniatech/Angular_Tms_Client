
import { Injectable, inject, PLATFORM_ID, signal } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import {
  HubConnection,
  HubConnectionBuilder
} from '@microsoft/signalr';
import { Subject } from 'rxjs';

export interface EnrollmentStatusEvent {
  id: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

@Injectable({
  providedIn: 'root'
})
export class LiveSyncService {

  private platformId = inject(PLATFORM_ID);

  private connection: HubConnection | null = null;

  private eventsSubject =
    new Subject<EnrollmentStatusEvent>();

  // Expose events as an Observable.
  // The store can subscribe to this stream.
  events$ = this.eventsSubject.asObservable();

  // Connection state for UI feedback.
  connectionState = signal<
    'connected' | 'reconnecting' | 'disconnected'
  >('disconnected');


  connect(): void {

    // Prevent duplicate connections.
    if (this.connection) {
      return;
    }

    // SignalR WebSocket connection should only run
    // in the browser.
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    // Create SignalR connection.
    this.connection = new HubConnectionBuilder()
      .withUrl('/hubs/tms')
      .withAutomaticReconnect([
        0,
        2000,
        10000,
        30000
      ])
      .build();


    // Listen for enrollment status updates
    // sent by the ASP.NET Core SignalR hub.
    this.connection.on(
      'ReceiveEnrollmentStatusUpdated',
      (
        enrollmentId: string,
        status: 'Pending' | 'Approved' | 'Rejected'
      ) => {

        this.eventsSubject.next({
          id: enrollmentId,
          status
        });
      }
    );


    // Connection is attempting to reconnect.
    this.connection.onreconnecting(() => {

      this.connectionState.set('reconnecting');
    });


    // Connection successfully reconnected.
    this.connection.onreconnected(() => {

      this.connectionState.set('connected');
    });


    // Connection closed.
    this.connection.onclose(() => {

      this.connectionState.set('disconnected');

      // Allow connect() to establish a new connection later.
      this.connection = null;
    });


    // Start SignalR connection.
    this.connection
      .start()
      .then(() => {

        this.connectionState.set('connected');

        console.log(
          'SignalR connected successfully.'
        );
      })
      .catch(err => {

        console.error(
          'SignalR connection error:',
          err
        );

        this.connectionState.set('disconnected');

        // Allow another connect() attempt.
        this.connection = null;
      });
  }


  disconnect(): void {

    if (!this.connection) {
      return;
    }

    this.connection
      .stop()
      .catch(err =>
        console.error(
          'SignalR disconnect error:',
          err
        )
      );
  }
}

