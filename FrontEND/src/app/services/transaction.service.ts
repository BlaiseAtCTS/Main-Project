import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransferRequest, GetTransactionsRequest } from '../models/transaction.model';
import { ApiResponse } from '../models/api-response.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080/transaction';

  constructor(
    private http: HttpClient,
    private authService: AuthService
  ) {}

  transfer(request: TransferRequest): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(
      `${this.apiUrl}/transfer`,
      request,
      { headers: this.authService.getAuthHeaders() }
    );
  }

  getTransactions(request: GetTransactionsRequest): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}/get-transactions`,
      { 
        headers: this.authService.getAuthHeaders(),
        params: { accountNumber: request.accountNumber }
      }
    );
  }
}
