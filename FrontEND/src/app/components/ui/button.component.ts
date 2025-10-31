import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../lib/utils';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button
      [class]="computedClass"
      [disabled]="disabled"
      [type]="type"
      (click)="handleClick($event)"
    >
      <ng-content></ng-content>
    </button>
  `,
  styles: []
})
export class ButtonComponent {
  @Input() variant: 'default' | 'secondary' | 'outline' | 'ghost' | 'destructive' = 'default';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() disabled = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() className = '';
  @Input() loading = false;

  get computedClass(): string {
    const baseClass = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';
    const sizes = {
      sm: 'h-9 px-3',
      md: 'h-10 px-4 py-2',
      lg: 'h-11 px-8'
    };
    const variants = {
      default: 'bg-gray-900 text-white hover:bg-gray-900/90',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-100/80',
      outline: 'border border-gray-200 bg-white hover:bg-gray-100 hover:text-gray-900',
      ghost: 'hover:bg-gray-100 hover:text-gray-900',
      destructive: 'bg-red-600 text-white hover:bg-red-700'
    } as const;
    return cn(baseClass, variants[this.variant], sizes[this.size], this.className);
  }

  handleClick(event: Event): void {
    if (this.disabled || this.loading) {
      event.preventDefault();
      event.stopPropagation();
    }
  }
}
