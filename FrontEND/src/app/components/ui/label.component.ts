import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../lib/utils';

@Component({
  selector: 'ui-label',
  standalone: true,
  imports: [CommonModule],
  template: `
    <label [class]="computedClass">
      <ng-content></ng-content>
    </label>
  `,
  styles: []
})
export class LabelComponent {
  @Input() className = '';

  get computedClass(): string {
    return cn(
      'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
      this.className
    );
  }
}
