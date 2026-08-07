import { Component, signal, computed, inject } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';

import { CourseCardComponent } from '../../ui/course-card/course-card.component';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

import { EnrollmentListComponent } from '../enrollment-list/enrollment-list';


@Component({
  selector: 'app-student-dashboard',
  standalone: true,

  imports: [
    CourseCardComponent,
    EnrollmentListComponent
  ],

  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent {


  private api = inject(CourseService);



  // Load courses from backend API
  coursesResource = rxResource({
    stream: () => this.api.getAll()
  });



  // Selected course after clicking Enroll
  selectedCourse = signal<Course | null>(null);



  // Convert resource data into signal
  courses = computed(() =>
    this.coursesResource.value() ?? []
  );



  // When user clicks enroll button
  handleEnroll(course: Course): void {

    this.selectedCourse.set(course);


    console.log(
      'Enrollment requested:',
      course.title
    );

  }

}