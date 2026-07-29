

// import { Component, signal } from '@angular/core';
// import { CourseCardComponent } from '../../ui/course-card/course-card';
// import { Course } from '../../models/course.model';


// @Component({
//   selector: 'app-student-dashboard',
//   standalone: true,
//   imports: [
//     CourseCardComponent
//   ],
//   templateUrl: './student-dashboard.component.html',
//   styleUrl: './student-dashboard.component.scss'
// })
// export class StudentDashboardComponent {


//   availableCourses = signal<Course[]>([
//     {
//       id: 1,
//       title: "Advanced Java Services",
//       code: "CSE-101",
//       maxCapacity: 30,
//       enrollmentCount: 10
//     },

//     {
//       id: 2,
//       title: "Angular UI Lab",
//       code: "CSE-210",
//       maxCapacity: 25,
//       enrollmentCount: 25
//     },

//     {
//       id: 3,
//       title: "Database Design",
//       code: "CSE-305",
//       maxCapacity: 20,
//       enrollmentCount: 18
//     },

//     {
//       id: 4,
//       title: "API Security Workshop",
//       code: "CSE-420",
//       maxCapacity: 40,
//       enrollmentCount: 15
//     }
//   ]);


//   selectedCourse = signal<Course | null>(null);


//   handleEnroll(course: Course) {

//     console.log("Enrollment requested:", course);

//     this.selectedCourse.set(course);

//   }


// }






import { Component, signal } from '@angular/core';
import { CourseCardComponent } from '../../ui/course-card/course-card';
import { Course } from '../../models/course.model';


@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [
    CourseCardComponent
  ],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent {


  availableCourses = signal<Course[]>([

    {
      id: 1,
      title: "Advanced Java Services",
      code: "CSE-101",
      description: "Learn advanced Java backend services and enterprise application development.",
      maxCapacity: 30,
      enrollmentCount: 10
    },


    {
      id: 2,
      title: "Angular UI Lab",
      code: "CSE-210",
      description: "Build modern Angular applications using standalone components and signals.",
      maxCapacity: 25,
      enrollmentCount: 25
    },


    {
      id: 3,
      title: "Database Design",
      code: "CSE-305",
      description: "Learn relational database design, normalization, and SQL optimization.",
      maxCapacity: 20,
      enrollmentCount: 18
    },


    {
      id: 4,
      title: "API Security Workshop",
      code: "CSE-420",
      description: "Learn API authentication, authorization, and security best practices.",
      maxCapacity: 40,
      enrollmentCount: 15
    }

  ]);


  selectedCourse = signal<Course | null>(null);



  handleEnroll(course: Course) {

    console.log("Enrollment requested:", course);

    this.selectedCourse.set(course);

  }


}