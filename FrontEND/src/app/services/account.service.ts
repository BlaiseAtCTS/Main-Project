import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountCreateRequest, AccountOperationRequest } from '../models/account.model';
import { ApiResponse } from '../models/api-response.model';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private apiUrl = `${environment.apiBaseUrl}/account`;

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  deposit(request: AccountOperationRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/deposit`,
      request,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  withdraw(request: AccountOperationRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/withdraw`,
      request,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getBalance(accountNumber: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/balance`,
      { accountNumber },
      { headers: this.authService.getAuthHeaders() }
    );
  }

  createAccount(request: AccountCreateRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/create`,
      request,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  generateAccountNumber(type: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/generate-account-number`,
      { type },
      { headers: this.authService.getAuthHeaders() }
    );
  }

  deleteAccount(accountNumber: string): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/delete`,
      { accountNumber },
      { headers: this.authService.getAuthHeaders() }
    );
  }
}
