import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

import {
  Course,
  CourseDetail
} from '../models/course.model';

import { PagedResponse } from '../models/paged-response.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private http = inject(HttpClient);

  private baseUrl = 'http://localhost:5071/api/v2/courses';

  getAll() {
    return this.http
      .get<PagedResponse<Course>>(this.baseUrl, {
        params: {
          page: '1',
          pageSize: '50'
        }
      })
      .pipe(
        map(response => response.data)
      );
  }

  getById(id: string) {
    return this.http.get<CourseDetail>(
      `${this.baseUrl}/${id}`
    );
  }

}