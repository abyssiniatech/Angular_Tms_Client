import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Course } from '../../models/course.model';

@Component({
  selector: 'tms-course-card',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './course-card.html',
  styleUrl: './course-card.scss'
})
export class CourseCardComponent {

  // Receive course from parent component
  course = input.required<Course>();

  // Send selected course to parent component
  enrollClicked = output<Course>();


  enroll() {
    this.enrollClicked.emit(this.course());
  }

}