import { Component } from '@angular/core';
import {
  RouterLink,
  RouterLinkActive,
} from '@angular/router';

interface NavItem {
  label: string;
  route: string;
  roles?: string[];
}

@Component({
  selector: 'app-nav-section',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './nav-section.component.html',
})
export class NavSectionComponent {

  private readonly currentRole = 'Admin';

  readonly navItems: NavItem[] = [
    {
      label: 'Dashboard',
      route: '/dashboard',
    },
    {
      label: 'Instructor Dashboard',
      route: '/instructor-dashboard',
      roles: ['Instructor'],
    },
    {
      label: 'Enrollments',
      route: '/enrollments',
      roles: ['Student'],
    },
    {
      label: 'Grade Submission',
      route: '/grade-submission',
      roles: ['Instructor'],
    },
    {
      label: 'Form Builder',
      route: '/form-builder',
      roles: ['Instructor', 'Admin'],
    },
    {
      label: 'Admin Courses',
      route: '/admin/courses',
      roles: ['Admin'],
    },
  ];

  get visibleItems(): NavItem[] {
    return this.navItems.filter(
      item =>
        !item.roles ||
        item.roles.includes(this.currentRole)
    );
  }
}