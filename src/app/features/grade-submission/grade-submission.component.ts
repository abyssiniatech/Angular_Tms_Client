import {
  Component,
  DestroyRef,
  inject
} from '@angular/core';

import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  Subject,
  EMPTY
} from 'rxjs';

import {
  catchError,
  exhaustMap,
  finalize
} from 'rxjs/operators';

import {
  takeUntilDestroyed
} from '@angular/core/rxjs-interop';

// Angular Material
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

// Application service
import {
  GradeService,
  GradePayload,
  GradeResponse
} from '../../services/grade.service';

@Component({
  selector: 'app-grade-submission',
  standalone: true,

  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],

  templateUrl: './grade-submission.component.html',
  styleUrl: './grade-submission.component.scss'
})
export class GradeSubmissionComponent {

  // --------------------------------------------------
  // Dependency Injection
  // --------------------------------------------------

  private readonly gradeService = inject(GradeService);
  private readonly fb = inject(FormBuilder);
  private readonly destroyRef = inject(DestroyRef);

  // --------------------------------------------------
  // Reactive Form
  // --------------------------------------------------

  readonly gradeForm = this.fb.nonNullable.group({

    studentId: [
      1,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    courseId: [
      24,
      [
        Validators.required,
        Validators.min(1)
      ]
    ],

    assessmentType: [
      'Midterm',
      [
        Validators.required
      ]
    ],

    score: [
      88,
      [
        Validators.required,
        Validators.min(0),
        Validators.max(100)
      ]
    ]

  });

  // --------------------------------------------------
  // UI State
  // --------------------------------------------------

  isSubmitting = false;

  submissionStatus = '';

  // --------------------------------------------------
  // Submission Event Stream
  // --------------------------------------------------

  private readonly submitClick$ =
    new Subject<GradePayload>();

  // --------------------------------------------------
  // Constructor
  // --------------------------------------------------

  constructor() {

    this.submitClick$
      .pipe(

        /*
         * Ignore additional submit events while
         * the current HTTP request is running.
         *
         * This protects the API from rapid
         * double-click / rage-click submissions.
         */
        exhaustMap(payload => {

          this.isSubmitting = true;

          this.submissionStatus =
            'Submitting grade...';

          return this.gradeService
            .postGrade(payload)
            .pipe(

              catchError(error => {

                console.error(
                  'Grade submission failed:',
                  error
                );

                this.submissionStatus =
                  this.getErrorMessage(error);

                return EMPTY;
              }),

              finalize(() => {

                this.isSubmitting = false;

              })

            );
        }),

        takeUntilDestroyed(this.destroyRef)

      )
      .subscribe({

        next: (result: GradeResponse) => {

          console.log(
            'Grade saved successfully:',
            result
          );

          this.submissionStatus =
            `Grade saved successfully! Record ID: ${result.id}`;

        }

      });
  }

  // --------------------------------------------------
  // Form Submit
  // --------------------------------------------------

  onSubmit(): void {

    /*
     * Extra protection.
     *
     * The button should already be disabled,
     * but this prevents programmatic submission
     * while a request is active.
     */
    if (this.isSubmitting) {
      return;
    }

    // Validate form
    if (this.gradeForm.invalid) {

      this.gradeForm.markAllAsTouched();

      this.submissionStatus =
        'Please correct the form errors before submitting.';

      return;
    }

    // Because the form uses nonNullable.group(),
    // these values are strongly typed.
    const formValue =
      this.gradeForm.getRawValue();

    // --------------------------------------------------
    // Build API payload
    // --------------------------------------------------

    const payload: GradePayload = {

      studentId: formValue.studentId,

      courseId: formValue.courseId,

      assessmentType:
        formValue.assessmentType.trim(),

      score: formValue.score

    };

    // --------------------------------------------------
    // Send submission event
    // --------------------------------------------------

    this.submitClick$.next(payload);
  }

  // --------------------------------------------------
  // Error Handling
  // --------------------------------------------------

  private getErrorMessage(error: any): string {

    const backendError = error?.error;

    // ASP.NET ProblemDetails
    if (backendError?.detail) {

      return `Submission failed: ${backendError.detail}`;
    }

    // Validation / application message
    if (backendError?.message) {

      return `Submission failed: ${backendError.message}`;
    }

    // Plain string response
    if (typeof backendError === 'string') {

      return `Submission failed: ${backendError}`;
    }

    // HTTP status fallback
    if (error?.status) {

      return `Submission failed: HTTP ${error.status}.`;
    }

    return 'Submission failed. Please try again.';
  }
}