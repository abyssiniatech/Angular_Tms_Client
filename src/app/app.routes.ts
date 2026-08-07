import { Routes } from '@angular/router';

import { StudentDashboardComponent }
  from './features/student-dashboard/student-dashboard.component';


export const routes: Routes = [

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },


  // Student Dashboard
  {
    path: 'dashboard',
    component: StudentDashboardComponent
  },


  // Instructor Dashboard (Module 9)
  {
    path: 'instructor-dashboard',
    loadComponent: () =>
      import('./features/instructor-dashboard/instructor-dashboard')
        .then(
          m => m.InstructorDashboardComponent
        )
  },


  // Enrollment Management
  {
    path: 'enrollments',
    loadComponent: () =>
      import('./features/enrollment-list/enrollment-list')
        .then(
          m => m.EnrollmentListComponent
        )
  },


  // Course Detail
  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./features/course-detail/course-detail')
        .then(
          m => m.CourseDetailComponent
        )
  },


  // Wildcard
  {
    path: '**',
    redirectTo: 'dashboard'
  }

];