import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-alert-dialog',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div *ngIf="open" class="fixed inset-0 z-50 flex items-center justify-center">
      <!-- Backdrop -->
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
        (click)="onCancel()"
      ></div>
      
      <!-- Dialog -->
      <div class="relative z-50 w-full max-w-lg mx-4 animate-fade-in">
        <div class="bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
          <ng-content></ng-content>
        </div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes fade-in {
      from {
        opacity: 0;
        transform: scale(0.95);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }
    
    .animate-fade-in {
      animation: fade-in 0.2s ease-out;
    }
  `]
})
export class AlertDialogComponent {
  @Input() open = false;
  @Output() openChange = new EventEmitter<boolean>();

  onCancel(): void {
    this.open = false;
    this.openChange.emit(false);
  }
}

@Component({
  selector: 'ui-alert-dialog-header',
  standalone: true,
  template: `
    <div class="p-6 pb-4">
      <ng-content></ng-content>
    </div>
  `
})
export class AlertDialogHeaderComponent {}

@Component({
  selector: 'ui-alert-dialog-title',
  standalone: true,
  template: `
    <h2 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
      <ng-content></ng-content>
    </h2>
  `
})
export class AlertDialogTitleComponent {}

@Component({
  selector: 'ui-alert-dialog-description',
  standalone: true,
  template: `
    <p class="text-sm text-gray-600 mt-2">
      <ng-content></ng-content>
    </p>
  `
})
export class AlertDialogDescriptionComponent {}

@Component({
  selector: 'ui-alert-dialog-content',
  standalone: true,
  template: `
    <div class="px-6 pb-4">
      <ng-content></ng-content>
    </div>
  `
})
export class AlertDialogContentComponent {}

@Component({
  selector: 'ui-alert-dialog-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 px-6 py-4 flex flex-col-reverse sm:flex-row sm:justify-end gap-2">
      <ng-content></ng-content>
    </div>
  `
})
export class AlertDialogFooterComponent {}
