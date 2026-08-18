import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { CourseService } from '../../services/course.service';
import { CourseDetail } from '../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss'
})
export class CourseDetailComponent {

  private readonly route = inject(ActivatedRoute);
  private readonly courseService = inject(CourseService);

  course?: CourseDetail;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      const courseId = Number(id);

      console.log('Route ID:', courseId);

      this.courseService.getById(courseId).subscribe({
        next: (course: CourseDetail) => {
          this.course = course;
          console.log('Course found:', course);
        },
        error: (err: unknown) => {
          console.error('Failed to load course:', err);
        }
      });
    }
  }
}