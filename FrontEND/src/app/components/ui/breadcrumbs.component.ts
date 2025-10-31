import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

export interface BreadcrumbItem {
  label: string;
  url?: string;
  icon?: string;
}

@Component({
  selector: 'ui-breadcrumbs',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400" aria-label="Breadcrumb">
      <a 
        routerLink="/"
        class="flex items-center hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      </a>
      
      <ng-container *ngFor="let item of items; let last = last">
        <svg class="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
        </svg>
        
        <a 
          *ngIf="item.url && !last"
          [routerLink]="item.url"
          class="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          {{ item.label }}
        </a>
        
        <span 
          *ngIf="!item.url || last"
          class="font-medium text-gray-900 dark:text-gray-100"
        >
          {{ item.label }}
        </span>
      </ng-container>
    </nav>
  `
})
export class BreadcrumbsComponent {
  @Input() items: BreadcrumbItem[] = [];
}
