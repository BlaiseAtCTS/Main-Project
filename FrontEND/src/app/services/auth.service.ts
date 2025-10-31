import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { UserLoginRequest, UserRegisterRequest } from '../models/user.model';
import { ApiResponse } from '../models/api-response.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiBaseUrl;
  private currentUserSubject = new BehaviorSubject<string | null>(this.getToken());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  register(request: UserRegisterRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/user/register`, request);
  }

  login(request: UserLoginRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(`${this.apiUrl}/user/login`, request).pipe(
      tap((response: ApiResponse) => {
        if (response.success && response.token) {
          localStorage.setItem('token', response.token);
          localStorage.setItem('role', response.role || 'USER');
          if (response.username || request.userName) {
            localStorage.setItem('username', response.username || request.userName);
          }
          this.currentUserSubject.next(response.token);
        }
      })
    );
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
    sessionStorage.clear();
    this.currentUserSubject.next(null);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  isAdmin(): boolean {
    return this.getRole() === 'ADMIN';
  }

  getUsername(): string | null {
    // Try to get username from localStorage or decode from token
    const username = localStorage.getItem('username');
    if (username) return username;
    
    // Fallback: return role or null
    const role = this.getRole();
    return role ? role.toLowerCase() : null;
  }

  getAuthHeaders(): HttpHeaders {
    const token = this.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }
}
