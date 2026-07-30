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

  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);

  course?: CourseDetail;

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      console.log('Route ID:', id);

      this.courseService.getById(id).subscribe({
        next: (course) => {
          this.course = course;
          console.log('Course found:', course);
        },
        error: (err) => {
          console.error('Failed to load course:', err);
        }
      });
    }
  }

}