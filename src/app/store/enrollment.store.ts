
import { computed, inject } from '@angular/core';

import {
  signalStore,
  withComputed,
  withMethods,
  patchState,
  withState
} from '@ngrx/signals';

import {
  withEntities,
  setAllEntities,
  updateEntity
} from '@ngrx/signals/entities';

import { rxMethod } from '@ngrx/signals/rxjs-interop';

import {
  pipe,
  concatMap,
  switchMap,
  tap,
  catchError,
  EMPTY
} from 'rxjs';

import { EnrollmentService } from '../services/enrollment.service';
import { Enrollment } from '../models/enrollment.model';
import { LiveSyncService } from '../services/live-sync';


interface EnrollmentState {
  isLoading: boolean;
  error: string | null;
}


export const EnrollmentStore = signalStore(

  {
    providedIn: 'root'
  },


  // ---------------------------------------------------------
  // Normal state
  // ---------------------------------------------------------
  withState<EnrollmentState>({
    isLoading: false,
    error: null
  }),


  // ---------------------------------------------------------
  // Enrollment entity collection
  // ---------------------------------------------------------
  withEntities<Enrollment>(),


  // ---------------------------------------------------------
  // Computed values
  // ---------------------------------------------------------
  withComputed((store) => ({

    pendingCount: computed(() =>
      store.entities()
        .filter(
          (enrollment: Enrollment) =>
            enrollment.status === 'Pending'
        )
        .length
    )

  })),


  // ---------------------------------------------------------
  // Store methods
  // ---------------------------------------------------------
  withMethods(
    (
      store,
      api = inject(EnrollmentService),
      sync = inject(LiveSyncService)
    ) => ({

      // -----------------------------------------------------
      // Listen for SignalR live enrollment updates
      //
      // LiveSyncService owns the SignalR connection.
      // EnrollmentStore owns the application state.
      // -----------------------------------------------------
      listenForLiveUpdates: rxMethod<void>(

        pipe(

          // Start SignalR connection when listening begins.
          tap(() => sync.connect()),

          // Listen to the LiveSyncService event stream.
          switchMap(() => sync.events$),

          // Update the matching enrollment in the store.
          tap((event) => {

            patchState(
              store,

              updateEntity<Enrollment>({
                id: event.id,
                changes: {
                  status: event.status
                }
              })
            );

          })

        )

      ),


      // -----------------------------------------------------
      // Get enrollments from API
      // -----------------------------------------------------
      loadEnrollments: rxMethod<void>(

        pipe(

          tap(() =>
            patchState(
              store,
              {
                isLoading: true,
                error: null
              }
            )
          ),

          concatMap(() =>

            api.getAll().pipe(

              tap((rows: Enrollment[]) =>

                patchState(
                  store,
                  setAllEntities(rows),
                  {
                    isLoading: false
                  }
                )

              ),

              catchError((error) => {

                patchState(
                  store,
                  {
                    isLoading: false,
                    error: error.message
                  }
                );

                return EMPTY;

              })

            )

          )

        )

      ),


      // -----------------------------------------------------
      // Approve enrollment
      // -----------------------------------------------------
      approveEnrollment: rxMethod<string>(

        pipe(

          // Update UI immediately.
          tap((id: string) => {

            patchState(
              store,

              updateEntity<Enrollment>({
                id,

                changes: {
                  status: 'Approved'
                }

              })

            );

          }),


          // Call backend.
          concatMap((id: string) =>

            api.approve(id).pipe(

              catchError(() => {

                // Rollback if backend rejects approval.
                patchState(
                  store,

                  updateEntity<Enrollment>({
                    id,

                    changes: {
                      status: 'Pending'
                    }

                  })

                );


                patchState(
                  store,
                  {
                    error: 'Server rejected the approval'
                  }
                );

                return EMPTY;

              })

            )

          )

        )

      )

    })

  )

);

