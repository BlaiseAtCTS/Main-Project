import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../lib/utils';

type Variant = 'default' | 'success' | 'warning' | 'error' | 'info';

@Component({
  selector: 'ui-alert',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClass" role="alert">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class AlertComponent {
  @Input() variant: Variant = 'default';
  @Input() className = '';

  get computedClass(): string {
    const baseClass = 'relative w-full rounded-lg border p-4';
    
    const variants: Record<Variant, string> = {
      default: 'bg-white text-gray-950 border-gray-200',
      success: 'bg-green-50 text-green-900 border-green-200',
      warning: 'bg-yellow-50 text-yellow-900 border-yellow-200',
      error: 'bg-red-50 text-red-900 border-red-200',
      info: 'bg-blue-50 text-blue-900 border-blue-200'
    };
    
    return cn(baseClass, variants[this.variant], this.className);
  }
}

@Component({
  selector: 'ui-alert-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h5 class="mb-1 font-medium leading-none tracking-tight">
      <ng-content></ng-content>
    </h5>
  `,
  styles: []
})
export class AlertTitleComponent {}

@Component({
  selector: 'ui-alert-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="text-sm opacity-90">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class AlertDescriptionComponent {}
