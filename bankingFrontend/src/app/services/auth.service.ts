import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, from } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserLoginRequest, UserRegisterRequest } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<string | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private apiService: ApiService, @Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem('token');
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
            localStorage.setItem('token', response.token);
          }
          this.currentUserSubject.next(response.token);
        } else {
          throw new Error(response.message || 'Login failed');
        }
      })
    );
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('token');
    }
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('token');
    }
    return false;
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('token');
    }
    return null;
  }
}
