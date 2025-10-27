import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { UserProfile } from '../models/user.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = `${environment.apiBaseUrl}/api/profile`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(
      this.apiUrl,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
