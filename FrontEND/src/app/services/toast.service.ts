import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  description?: string;
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toasts = signal<Toast[]>([]);
  
  getToasts = this.toasts.asReadonly();

  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  success(title: string, description?: string, duration: number = 4000) {
    this.show('success', title, description, duration);
  }

  error(title: string, description?: string, duration: number = 5000) {
    this.show('error', title, description, duration);
  }

  warning(title: string, description?: string, duration: number = 4500) {
    this.show('warning', title, description, duration);
  }

  info(title: string, description?: string, duration: number = 4000) {
    this.show('info', title, description, duration);
  }

  private show(type: Toast['type'], title: string, description?: string, duration?: number) {
    const toast: Toast = {
      id: this.generateId(),
      type,
      title,
      description,
      duration
    };

    this.toasts.update(toasts => [...toasts, toast]);

    if (duration) {
      setTimeout(() => {
        this.dismiss(toast.id);
      }, duration);
    }
  }

  dismiss(id: string) {
    this.toasts.update(toasts => toasts.filter(t => t.id !== id));
  }

  dismissAll() {
    this.toasts.set([]);
  }
}
