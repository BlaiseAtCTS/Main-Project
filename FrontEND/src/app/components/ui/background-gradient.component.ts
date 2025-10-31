import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../lib/utils';

@Component({
  selector: 'ui-background-gradient',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="wrapperClass">
      <div [class]="gradientClass"></div>
      <div [class]="contentClass">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: []
})
export class BackgroundGradientComponent {
  @Input() className = '';
  @Input() containerClassName = '';
  @Input() animate = true;

  get wrapperClass(): string {
    return cn(
      'relative p-[4px] group',
      this.containerClassName
    );
  }

  get gradientClass(): string {
    const animationClass = this.animate 
      ? 'animate-gradient-xy bg-[length:400%_400%]' 
      : '';
    
    return cn(
      'absolute inset-0 rounded-lg bg-gradient-to-r from-primary-400 via-secondary-500 to-primary-600 opacity-75 blur-sm transition duration-500 group-hover:opacity-100',
      animationClass
    );
  }

  get contentClass(): string {
    return cn(
      'relative rounded-lg bg-white',
      this.className
    );
  }
}
