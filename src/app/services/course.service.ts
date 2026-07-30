import { Injectable, signal } from '@angular/core';
import { Course } from '../models/course.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  private courses = signal<Course[]>([
    {
      id: 1,
      code: 'CSE-101',
      title: 'Angular Fundamentals',
      description: 'Learn Angular components, signals and routing',
      maxCapacity: 30,
      enrollmentCount: 15
    },
    {
      id: 2,
      code: 'CSE-102',
      title: 'TypeScript Advanced',
      description: 'Advanced TypeScript concepts including types, interfaces and generics',
      maxCapacity: 25,
      enrollmentCount: 10
    },
    {
      id: 3,
      code: 'CSE-103',
      title: 'Web API Development',
      description: 'Build REST APIs using ASP.NET Core and Entity Framework Core',
      maxCapacity: 40,
      enrollmentCount: 22
    },
    {
      id: 4,
      code: 'CSE-104',
      title: 'Database Systems',
      description: 'Learn SQL, PostgreSQL, database design and optimization',
      maxCapacity: 35,
      enrollmentCount: 28
    },
    {
      id: 5,
      code: 'CSE-105',
      title: 'Object Oriented Programming',
      description: 'Master OOP principles using C# and modern programming patterns',
      maxCapacity: 30,
      enrollmentCount: 18
    },
    {
      id: 6,
      code: 'CSE-106',
      title: 'Full Stack Development',
      description: 'Build full stack applications with Angular and .NET',
      maxCapacity: 50,
      enrollmentCount: 35
    },
    {
      id: 7,
      code: 'CSE-107',
      title: 'Software Architecture',
      description: 'Learn Clean Architecture, Onion Architecture and design patterns',
      maxCapacity: 25,
      enrollmentCount: 12
    },
    {
      id: 8,
      code: 'CSE-108',
      title: 'Cloud Computing',
      description: 'Introduction to cloud services, deployment and DevOps practices',
      maxCapacity: 40,
      enrollmentCount: 20
    },
    {
      id: 9,
      code: 'CSE-109',
      title: 'Cyber Security Fundamentals',
      description: 'Learn security concepts, authentication and application protection',
      maxCapacity: 30,
      enrollmentCount: 16
    },
    {
      id: 10,
      code: 'CSE-110',
      title: 'Mobile Application Development',
      description: 'Create modern mobile applications using cross-platform frameworks',
      maxCapacity: 35,
      enrollmentCount: 25
    }
  ]);


  getCourses() {
    return this.courses();
  }


  getCourseById(id: number) {
    return this.courses()
      .find(course => course.id === id);
  }

}