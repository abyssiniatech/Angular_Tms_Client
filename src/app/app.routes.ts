import { Routes } from '@angular/router';

import { StudentDashboardComponent } from './features/student-dashboard/student-dashboard.component';

export const routes: Routes = [

  // --------------------------------------------------
  // Default Route
  // --------------------------------------------------

  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },

  // --------------------------------------------------
  // Student Dashboard
  // --------------------------------------------------

  {
    path: 'dashboard',
    component: StudentDashboardComponent
  },

  // --------------------------------------------------
  // Instructor Dashboard
  // --------------------------------------------------

  {
    path: 'instructor-dashboard',
    loadComponent: () =>
      import('./features/instructor-dashboard/instructor-dashboard')
        .then(m => m.InstructorDashboardComponent)
  },

  // --------------------------------------------------
  // Enrollment Management
  // --------------------------------------------------

  {
    path: 'enrollments',
    loadComponent: () =>
      import('./features/enrollment-list/enrollment-list')
        .then(m => m.EnrollmentListComponent)
  },

  // --------------------------------------------------
  // Course Detail
  // --------------------------------------------------

  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./features/course-detail/course-detail')
        .then(m => m.CourseDetailComponent)
  },

  // --------------------------------------------------
  // Grade Submission
  // --------------------------------------------------

  {
    path: 'grade-submission',
    loadComponent: () =>
      import('./features/grade-submission/grade-submission.component')
        .then(m => m.GradeSubmissionComponent)
  },

  // --------------------------------------------------
  // Grade Report
  // --------------------------------------------------

  // Uncomment when GradeReportComponent exists.
  //
  // {
  //   path: 'grade-report',
  //   loadComponent: () =>
  //     import('./features/grade-report/grade-report')
  //       .then(m => m.GradeReportComponent)
  // },

  // --------------------------------------------------
  // Form Builder
  // --------------------------------------------------

  {
    path: 'form-builder',
    loadComponent: () =>
      import('./features/form-builder/form-builder.component')
        .then(m => m.FormBuilderComponent)
  },

  // --------------------------------------------------
  // Wildcard Route
  // Must always be LAST
  // --------------------------------------------------

  {
    path: '**',
    redirectTo: 'dashboard'
  }

];