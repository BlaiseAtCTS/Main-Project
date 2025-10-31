import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-toaster',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-0 right-0 z-[100] flex max-h-screen w-full flex-col-reverse p-4 sm:top-auto sm:right-0 sm:bottom-0 sm:flex-col md:max-w-[420px] pointer-events-none">
      <div 
        *ngFor="let toast of toasts()"
        [@slideIn]
        class="pointer-events-auto group relative flex w-full items-center justify-between space-x-4 overflow-hidden rounded-lg border p-4 pr-8 shadow-lg transition-all mb-2"
        [ngClass]="{
          'bg-white border-gray-200 text-gray-900': toast.type === 'info',
          'bg-emerald-50 border-emerald-200 text-emerald-900': toast.type === 'success',
          'bg-rose-50 border-rose-200 text-rose-900': toast.type === 'error',
          'bg-amber-50 border-amber-200 text-amber-900': toast.type === 'warning'
        }"
      >
        <div class="flex items-start gap-3">
          <!-- Icon -->
          <div class="flex-shrink-0 mt-0.5">
            <!-- Success Icon -->
            <svg *ngIf="toast.type === 'success'" class="h-5 w-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <!-- Error Icon -->
            <svg *ngIf="toast.type === 'error'" class="h-5 w-5 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            
            <!-- Warning Icon -->
            <svg *ngIf="toast.type === 'warning'" class="h-5 w-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            
            <!-- Info Icon -->
            <svg *ngIf="toast.type === 'info'" class="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          
          <!-- Content -->
          <div class="flex-1">
            <p class="text-sm font-semibold">{{ toast.title }}</p>
            <p *ngIf="toast.description" class="text-sm opacity-90 mt-1">{{ toast.description }}</p>
          </div>
        </div>
        
        <!-- Close Button -->
        <button
          (click)="dismiss(toast.id)"
          class="absolute right-2 top-2 rounded-md p-1 opacity-0 transition-opacity hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 group-hover:opacity-100"
          [ngClass]="{
            'text-gray-500 hover:text-gray-700 focus:ring-gray-400': toast.type === 'info',
            'text-emerald-500 hover:text-emerald-700 focus:ring-emerald-400': toast.type === 'success',
            'text-rose-500 hover:text-rose-700 focus:ring-rose-400': toast.type === 'error',
            'text-amber-500 hover:text-amber-700 focus:ring-amber-400': toast.type === 'warning'
          }"
        >
          <svg class="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  `,
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('200ms ease-out', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('150ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToasterComponent {
  private toastService = inject(ToastService);
  
  toasts = this.toastService.getToasts;

  dismiss(id: string) {
    this.toastService.dismiss(id);
  }
}
