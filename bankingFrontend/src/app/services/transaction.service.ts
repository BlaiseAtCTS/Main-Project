import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TransferRequest } from '../models/transaction.model';
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

  transfer(transferRequest: TransferRequest): Observable<string> {
    return this.http.post<string>(`${this.apiUrl}/transaction/transfer`, transferRequest, {
      headers: this.getHeaders(),
    });
  }
}
