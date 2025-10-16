import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserLoginRequest, UserRegisterRequest } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { ApiService } from './api.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private apiService: ApiService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private storage: StorageService
  ) {
    if (isPlatformBrowser(this.platformId) && this.storage.isAvailable()) {
      const token = this.storage.getItem('token');
      if (token) {
        this.currentUserSubject.next(token);
      }
    }
  }

  register(user: UserRegisterRequest) {
    return from(this.apiService.register(user));
  }

  login(credentials: UserLoginRequest) {
    return from(this.apiService.login(credentials.userName, credentials.password)).pipe(
      tap((response: ApiResponse) => {
        if (response.success && response.token) {
          if (isPlatformBrowser(this.platformId)) {
            this.storage.setItem('token', response.token);
            // Also save role if available
            if (response.role) {
              this.storage.setItem('role', response.role);
              localStorage.setItem('role', response.role);
            }
          }
          // Emit token change to notify all subscribers
          this.currentUserSubject.next(response.token);
          console.log('🔔 Auth service: Login successful, notified subscribers');
        } else {
          throw new Error(response.message || 'Login failed');
        }
      })
    );
  }

  logout(): void {
    console.log('🔔 Auth service: Logout called');
    if (isPlatformBrowser(this.platformId)) {
      this.storage.removeItem('token');
      this.storage.removeItem('role');
      localStorage.clear();
      sessionStorage.clear();
    }
    // Emit null to notify all subscribers
    this.currentUserSubject.next(null);
    console.log('🔔 Auth service: Logout complete, notified subscribers');
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!this.storage.getItem('token');
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return this.storage.getItem('token');
    }
    return null;
  }
}
