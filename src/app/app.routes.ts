// import { Routes } from '@angular/router';
// import { StudentDashboardComponent } from './features/student-dashboard/student-dashboard.component';

// export const routes: Routes = [

//   {
//     path: 'dashboard',
//     component: StudentDashboardComponent
//   },

//   {
//     path: 'courses/:id',
//     loadComponent: () =>
//       import('./features/course-detail/course-detail')
//         .then(m => m.CourseDetail)
//   },

//   {
//     path: '',
//     redirectTo: 'dashboard',
//     pathMatch: 'full'
//   }





import { Routes } from '@angular/router';
import { StudentDashboardComponent } from './features/student-dashboard/student-dashboard.component';


export const routes: Routes = [

{
 path:'dashboard',
 component:StudentDashboardComponent
},


{
 path:'enroll',
 loadComponent:()=> 
 import('./features/enrollment-form/enrollment-form')
 .then(m=>m.EnrollmentFormComponent)
},


{
  path: 'courses/:id',
  loadComponent: () =>
    import('./features/course-detail/course-detail')
      .then(m => m.CourseDetailComponent)
},

{
 path:'',
 redirectTo:'dashboard',
 pathMatch:'full'
}


];