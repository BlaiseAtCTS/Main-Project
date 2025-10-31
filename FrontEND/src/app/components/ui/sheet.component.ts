import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'ui-sheet',
  standalone: true,
  imports: [CommonModule],
  animations: [
    trigger('slideIn', [
      state('open', style({ transform: 'translateX(0)' })),
      state('closed', style({ transform: 'translateX(-100%)' })),
      transition('closed => open', animate('300ms ease-out')),
      transition('open => closed', animate('250ms ease-in'))
    ]),
    trigger('fadeBackdrop', [
      state('open', style({ opacity: 1 })),
      state('closed', style({ opacity: 0 })),
      transition('closed => open', animate('300ms ease-out')),
      transition('open => closed', animate('250ms ease-in'))
    ])
  ],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex">
      <!-- Backdrop -->
      <div 
        [@fadeBackdrop]="open ? 'open' : 'closed'"
        class="fixed inset-0 bg-black/50"
        (click)="close()"
      ></div>
      
      <!-- Sheet -->
      <div 
        [@slideIn]="open ? 'open' : 'closed'"
        [class]="'fixed top-0 left-0 bottom-0 bg-white dark:bg-gray-900 shadow-lg z-50 ' + sizeClass"
      >
        <div class="flex flex-col h-full">
          <!-- Header -->
          <div class="flex items-center justify-between p-4 border-b">
            <h2 class="text-lg font-semibold">{{ title }}</h2>
            <button 
              (click)="close(); $event.stopPropagation()"
              class="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md transition-colors"
              aria-label="Close"
              type="button"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <!-- Content -->
          <div class="flex-1 overflow-y-auto p-4">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    </div>
  `
})
export class SheetComponent {
  @Input() open = false;
  @Input() title = '';
  @Input() side: 'left' | 'right' = 'left';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Output() openChange = new EventEmitter<boolean>();

  get sizeClass(): string {
    const sizes = {
      sm: 'w-64',
      md: 'w-80',
      lg: 'w-96',
      xl: 'w-[28rem]'
    };
    return sizes[this.size];
  }

  close(): void {
    this.open = false;
    this.openChange.emit(false);
  }

  @HostListener('document:keydown.escape')
  onEscape(): void {
    if (this.open) {
      this.close();
    }
  }
}
