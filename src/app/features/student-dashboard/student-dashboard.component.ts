

import { CourseCardComponent } from './../../ui/course-card/course-card.component';
import { Component, signal } from '@angular/core';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CourseCardComponent],
  templateUrl: './student-dashboard.component.html',
  styleUrl: './student-dashboard.component.scss'
})
export class StudentDashboardComponent {

  selectedCourse = signal<Course | null>(null);


  availableCourses = signal<Course[]>([
    {
      id: 1,
      title: 'Advanced Java Services',
      code: 'CSE-101',
      maxCapacity: 30,
      enrollmentCount: 10,
      description: 'Advanced Java programming and backend services'
    },

    {
      id: 2,
      title: 'Angular UI Lab',
      code: 'CSE-210',
      maxCapacity: 25,
      enrollmentCount: 25,
      description: 'Angular standalone components and signals'
    },

    {
      id: 3,
      title: 'Database Design',
      code: 'CSE-305',
      maxCapacity: 20,
      enrollmentCount: 18,
      description: 'Database architecture and SQL design'
    },

    {
      id: 4,
      title: 'API Security Workshop',
      code: 'CSE-420',
      maxCapacity: 40,
      enrollmentCount: 15,
      description: 'Secure API development'
    }
  ]);


  handleEnroll(course: Course) {

    this.selectedCourse.set(course);

    console.log(
      'Enrollment requested:',
      course.title
    );

  }

}