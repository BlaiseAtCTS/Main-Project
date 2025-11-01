import { inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { environment } from '../../environments/environment';
import { AccountRequest } from '../models/account-request.model';

export function useAccountRequests() {
  const http = inject(HttpClient);

  return injectQuery(() => ({
    queryKey: ['accountRequests'],
    queryFn: () =>
      http
        .get<AccountRequest[]>(`${environment.apiBaseUrl}/api/user/account-requests`)
        .toPromise() as Promise<AccountRequest[]>,
    staleTime: 1000 * 60 * 2, // 2 minutes
  }));
}

export function usePendingAccountRequests() {
  const http = inject(HttpClient);

  return injectQuery(() => ({
    queryKey: ['accountRequests', 'pending'],
    queryFn: () =>
      http
        .get<AccountRequest[]>(`${environment.apiBaseUrl}/api/user/account-requests/pending`)
        .toPromise() as Promise<AccountRequest[]>,
    staleTime: 1000 * 30, // 30 seconds - more frequent for pending
  }));
}
