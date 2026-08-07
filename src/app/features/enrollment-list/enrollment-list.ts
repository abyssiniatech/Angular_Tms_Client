// import { Component, inject, OnInit } from '@angular/core';
// import { EnrollmentStore } from '../../store/enrollment.store';


// @Component({
//   selector: 'tms-enrollment-list',
//   standalone: true,
//   templateUrl: './enrollment-list.html'
// })
// export class EnrollmentListComponent implements OnInit {

//   readonly store = inject(EnrollmentStore);


//   ngOnInit(): void {
//     this.store.loadEnrollments();
//   }


//   onApprove(id: string): void {
//     this.store.approveEnrollment(id);
//   }

// }







import { Component, inject, OnInit } from '@angular/core';
import { EnrollmentStore } from '../../store/enrollment.store';


@Component({
  selector: 'tms-enrollment-list',
  standalone: true,
  templateUrl: './enrollment-list.html'
})
export class EnrollmentListComponent implements OnInit {

  readonly store = inject(EnrollmentStore);


  ngOnInit(): void {
    this.store.loadEnrollments();
  }


  onApprove(id: string): void {
    this.store.approveEnrollment(id);
  }

}