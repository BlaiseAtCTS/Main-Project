import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../lib/utils';

@Component({
  selector: 'ui-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClass" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  `,
  styles: [`
    .spinner {
      border: 2px solid rgba(0, 0, 0, 0.1);
      border-left-color: currentColor;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class SpinnerComponent {
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() className = '';

  get computedClass(): string {
    const sizes = {
      sm: 'h-4 w-4',
      md: 'h-6 w-6',
      lg: 'h-8 w-8'
    };
    
    return cn('spinner rounded-full', sizes[this.size], this.className);
  }
}
