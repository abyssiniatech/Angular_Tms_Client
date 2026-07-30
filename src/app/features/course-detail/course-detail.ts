import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CourseService } from '../../services/course.service';
import { Course } from '../../models/course.model';

@Component({
  selector: 'app-course-detail',
  standalone: true,
  templateUrl: './course-detail.html',
  styleUrl: './course-detail.scss'
})
export class CourseDetail {

  private route = inject(ActivatedRoute);
  private courseService = inject(CourseService);

  course?: Course;


  constructor() {

    const id = Number(
      this.route.snapshot.paramMap.get('id')
    );

    console.log('Route ID:', id);

    this.course = this.courseService.getCourseById(id);

    console.log('Course found:', this.course);

  }

}