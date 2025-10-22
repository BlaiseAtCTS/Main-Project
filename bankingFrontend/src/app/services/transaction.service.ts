import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { TransferRequest } from '../models/transaction.model';
import { ApiResponse } from '../models/api-response.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  private apiUrl = 'http://localhost:8080';

  constructor(private http: HttpClient, private storage: StorageService) {}

  private getHeaders(): HttpHeaders {
    const token = this.storage.getItem('token') || '';
    const headers: { [header: string]: string | string[] } = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    return new HttpHeaders(headers);
  }

  async transfer(transferRequest: TransferRequest): Promise<ApiResponse> {
    return await firstValueFrom(
      this.http.post<ApiResponse>(`${this.apiUrl}/transaction/transfer`, transferRequest, {
        headers: this.getHeaders(),
      })
    );
  }
}
