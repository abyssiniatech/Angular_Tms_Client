import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../../services/auth.service';

@Component({
  selector: 'app-admin-course-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-course-list.html',
  // styleUrl: './admin-course-list.css',
})
export class AdminCourseListComponent implements OnInit {

  // ============================================================
  // Services
  // ============================================================

  auth = inject(AuthService);


  // ============================================================
  // Courses
  // ============================================================

  courses: any[] = [];

  loading = false;
  errorMessage = '';


  // ============================================================
  // Lifecycle
  // ============================================================

  ngOnInit(): void {
    this.loadCourses();
  }


  // ============================================================
  // Load Courses
  // ============================================================

  loadCourses(): void {

    this.loading = true;
    this.errorMessage = '';

    /*
     * Connect this method to your existing CourseService.
     *
     * Example:
     *
     * this.courseService.getCourses().subscribe({
     *   next: courses => {
     *     this.courses = courses;
     *     this.loading = false;
     *   },
     *   error: () => {
     *     this.errorMessage = 'Unable to load courses.';
     *     this.loading = false;
     *   }
     * });
     */

    this.loading = false;
  }


  // ============================================================
  // Delete Course
  // ============================================================

  deleteCourse(courseId: number): void {

    // Extra client-side protection
    if (!this.auth.hasRole('Admin')) {
      return;
    }

    const confirmed =
      window.confirm(
        'Are you sure you want to delete this course?'
      );

    if (!confirmed) {
      return;
    }

    /*
     * Connect this method to your existing CourseService.
     *
     * Example:
     *
     * this.courseService.deleteCourse(courseId).subscribe({
     *   next: () => {
     *     this.courses =
     *       this.courses.filter(course => course.id !== courseId);
     *   },
     *   error: () => {
     *     this.errorMessage = 'Unable to delete the course.';
     *   }
     * });
     */
  }
}