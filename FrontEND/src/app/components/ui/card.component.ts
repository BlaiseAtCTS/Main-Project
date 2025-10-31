import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { cn } from '../../lib/utils';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardComponent {
  @Input() className = '';
  @Input() hover = false;

  get computedClass(): string {
  const baseClass = 'rounded-lg border border-gray-200 bg-white text-gray-900 shadow-sm';
    const hoverClass = this.hover ? 'transition-all hover:shadow-lg hover:-translate-y-1' : '';
    return cn(baseClass, hoverClass, this.className);
  }
}

@Component({
  selector: 'ui-card-header',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardHeaderComponent {
  @Input() className = '';

  get computedClass(): string {
    return cn('flex flex-col space-y-1.5 p-6', this.className);
  }
}

@Component({
  selector: 'ui-card-title',
  standalone: true,
  imports: [CommonModule],
  template: `
    <h3 [class]="computedClass">
      <ng-content></ng-content>
    </h3>
  `,
  styles: []
})
export class CardTitleComponent {
  @Input() className = '';

  get computedClass(): string {
    return cn('text-2xl font-semibold leading-none tracking-tight', this.className);
  }
}

@Component({
  selector: 'ui-card-description',
  standalone: true,
  imports: [CommonModule],
  template: `
    <p [class]="computedClass">
      <ng-content></ng-content>
    </p>
  `,
  styles: []
})
export class CardDescriptionComponent {
  @Input() className = '';

  get computedClass(): string {
  return cn('text-sm text-gray-500/90', this.className);
  }
}

@Component({
  selector: 'ui-card-content',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardContentComponent {
  @Input() className = '';

  get computedClass(): string {
    return cn('p-6 pt-0', this.className);
  }
}

@Component({
  selector: 'ui-card-footer',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="computedClass">
      <ng-content></ng-content>
    </div>
  `,
  styles: []
})
export class CardFooterComponent {
  @Input() className = '';

  get computedClass(): string {
    return cn('flex items-center p-6 pt-0', this.className);
  }
}
