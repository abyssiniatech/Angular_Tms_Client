// // import { Component, inject, OnInit } from '@angular/core';
// // import { EnrollmentStore } from '../../store/enrollment.store';


// // @Component({
// //   selector: 'tms-enrollment-list',
// //   standalone: true,
// //   templateUrl: './enrollment-list.html'
// // })
// // export class EnrollmentListComponent implements OnInit {

// //   readonly store = inject(EnrollmentStore);


// //   ngOnInit(): void {
// //     this.store.loadEnrollments();
// //   }


// //   onApprove(id: string): void {
// //     this.store.approveEnrollment(id);
// //   }

// // }







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




import {
Component,
effect,
inject,
viewChild
}
from '@angular/core';


import {
MatTableDataSource,
MatTableModule
}
from '@angular/material/table';


import {
MatPaginator,
MatPaginatorModule
}
from '@angular/material/paginator';


import {
MatSort,
MatSortModule
}
from '@angular/material/sort';


import {EnrollmentStore}
from '../../store/enrollment.store';



@Component({

selector:'tms-enrollment-list',

standalone:true,

imports:[
MatTableModule,
MatPaginatorModule,
MatSortModule
],

templateUrl:'./enrollment-list.html',

styleUrl:'./enrollment-list.scss'

})


export class EnrollmentListComponent {


store = inject(EnrollmentStore);



displayedColumns=[

'studentName',
'courseName',
'status',
'actions'

];


dataSource =
new MatTableDataSource();



readonly paginator =
viewChild.required(MatPaginator);


readonly sort =
viewChild.required(MatSort);



constructor(){


effect(()=>{

this.dataSource.data =
this.store.entities();


});



effect(()=>{


this.dataSource.paginator =
this.paginator();


this.dataSource.sort =
this.sort();


});


this.store.loadEnrollments();


}



}