
import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { EnrollmentStore } from './store/enrollment.store';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class AppComponent implements OnInit {

  private store = inject(EnrollmentStore);

  ngOnInit(): void {

    // Load initial enrollment data from the API.
    this.store.loadEnrollments();

    // Start SignalR and listen for live enrollment updates.
    this.store.listenForLiveUpdates();
  }
}

