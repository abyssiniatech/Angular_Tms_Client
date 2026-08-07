import { Routes } from '@angular/router';

import { StudentDashboardComponent }
from './features/student-dashboard/student-dashboard.component';


export const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },


  {
    path: 'dashboard',
    component: StudentDashboardComponent
  },


  {
    path: 'enrollments',
    loadComponent: () =>
      import('./features/enrollment-list/enrollment-list')
        .then(
          m => m.EnrollmentListComponent
        )
  },


  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./features/course-detail/course-detail')
        .then(
          m => m.CourseDetailComponent
        )
  },


  {
    path: '**',
    redirectTo: 'dashboard'
  }

];