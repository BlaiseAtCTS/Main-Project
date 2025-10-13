import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private available = typeof window !== 'undefined' && !!window.localStorage;

  getItem(key: string): string | null {
    try {
      if (!this.available) return null;
      return window.localStorage.getItem(key);
    } catch (e) {
      return null;
    }
  }

  setItem(key: string, value: string): void {
    try {
      if (!this.available) return;
      window.localStorage.setItem(key, value);
    } catch (e) {
      // noop
    }
  }

  removeItem(key: string): void {
    try {
      if (!this.available) return;
      window.localStorage.removeItem(key);
    } catch (e) {
      // noop
    }
  }

  isAvailable(): boolean {
    return this.available;
  }
}
