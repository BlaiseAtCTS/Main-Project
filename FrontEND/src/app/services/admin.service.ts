import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountRequest, UserAccountData } from '../models/admin.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  getPendingRequests(): Observable<AccountRequest[]> {
    return this.http.get<AccountRequest[]>(
      `${this.apiUrl}/requests/pending`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getCreateRequests(): Observable<AccountRequest[]> {
    return this.http.get<AccountRequest[]>(
      `${this.apiUrl}/requests/create`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getDeleteRequests(): Observable<AccountRequest[]> {
    return this.http.get<AccountRequest[]>(
      `${this.apiUrl}/requests/delete`,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  updateRequestStatus(id: number, status: string): Observable<AccountRequest> {
    return this.http.put<AccountRequest>(
      `${this.apiUrl}/requests/${id}/${status}`,
      {},
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getAllUsers(): Observable<UserAccountData[]> {
    return this.http.get<UserAccountData[]>(
      `${this.apiUrl}/users`,
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
