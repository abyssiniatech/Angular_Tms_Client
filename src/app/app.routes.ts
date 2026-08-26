import { Routes } from '@angular/router';

import { StudentDashboardComponent } from './features/student-dashboard/student-dashboard.component';
import { UnauthorizedComponent } from './features/unauthorized/unauthorized.component';

import { roleGuard } from './guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },

  {
    path: 'dashboard',
    component: StudentDashboardComponent,
  },

  {
    path: 'instructor-dashboard',
    loadComponent: () =>
      import('./features/instructor-dashboard/instructor-dashboard').then(
        (m) => m.InstructorDashboardComponent,
      ),
  },

  {
    path: 'enrollments',
    loadComponent: () =>
      import('./features/enrollment-list/enrollment-list').then(
        (m) => m.EnrollmentListComponent,
      ),
  },

  {
    path: 'courses/:id',
    loadComponent: () =>
      import('./features/course-detail/course-detail').then(
        (m) => m.CourseDetailComponent,
      ),
  },

  {
    path: 'grade-submission',
    loadComponent: () =>
      import('./features/grade-submission/grade-submission.component').then(
        (m) => m.GradeSubmissionComponent,
      ),
  },

  {
    path: 'form-builder',
    loadComponent: () =>
      import('./features/form-builder/form-builder.component').then(
        (m) => m.FormBuilderComponent,
      ),
  },

  {
    path: 'admin/courses',
    loadComponent: () =>
      import('./features/admin/courses/admin-course-list/admin-course-list').then(
        (m) => m.AdminCourseListComponent,
      ),
    canActivate: [roleGuard('Admin')],
  },

  {
    path: 'unauthorized',
    component: UnauthorizedComponent,
  },

  {
    path: '**',
    redirectTo: 'dashboard',
  },
];