import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface GradePayload {
  studentId: number;
  courseId: number;
  assessmentType: string;
  score: number;
}

export interface GradeResponse {
  id: number;
  studentId: number;
  courseId: number;
  assessmentType: string;
  score: number;
}

@Injectable({
  providedIn: 'root'
})
export class GradeService {

  private readonly http = inject(HttpClient);

  private readonly endpoint = '/api/v2/grades';

  /**
   * Submit a grade to the ASP.NET Core API.
   */
  postGrade(payload: GradePayload): Observable<GradeResponse> {
    return this.http.post<GradeResponse>(
      this.endpoint,
      payload
    );
  }
}