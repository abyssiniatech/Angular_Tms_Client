import { inject } from '@angular/core';
import { patchState, signalStore, withMethods } from '@ngrx/signals';
import {
  removeEntity,
  setAllEntities,
  withEntities
} from '@ngrx/signals/entities';
import { catchError, EMPTY } from 'rxjs';

import { CourseService } from '../services/course.service';
import { Course } from '../models/course.model';

export const CourseStore = signalStore(
  {
    providedIn: 'root'
  },

  withEntities<Course>(),

  withMethods((store, svc = inject(CourseService)) => ({
    deleteCourse(id: number) {

      // 1. SNAPSHOT BEFORE MUTATION
      const previousSnapshot = store.entities();

      // 2. OPTIMISTICALLY REMOVE FROM UI
      patchState(
        store,
        removeEntity(id)
      );

      // 3. DELETE FROM SERVER
      svc.delete(id).pipe(

        catchError(err => {

          // 4. SERVER REJECTED → ROLLBACK
          patchState(
            store,
            setAllEntities(previousSnapshot)
          );

          // 5. STORE ERROR
          console.error('Course deletion failed:', err);

          return EMPTY;
        })

      ).subscribe();
    }
  }))
);