import { inject } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { TransactionService } from '../services/transaction.service';
import { TransferRequest, GetTransactionsRequest } from '../models/transaction.model';
import { lastValueFrom } from 'rxjs';

/**
 * TanStack Query hook for fetching transactions
 */
export function useTransactions(accountNumber: string) {
  const transactionService = inject(TransactionService);
  
  return injectQuery(() => ({
    queryKey: ['transactions', accountNumber],
    queryFn: async () => {
      return await lastValueFrom(
        transactionService.getTransactions({ accountNumber })
      );
    },
    enabled: !!accountNumber,
    staleTime: 1000 * 60, // 1 minute
  }));
}

/**
 * TanStack Query hook for money transfer
 */
export function useTransfer() {
  const transactionService = inject(TransactionService);
  const queryClient = injectQueryClient();
  
  return injectMutation(() => ({
    mutationKey: ['transaction', 'transfer'],
    mutationFn: async (data: TransferRequest) => {
      return await lastValueFrom(transactionService.transfer(data));
    },
    onSuccess: (_, variables) => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: ['account', 'balance', variables.sourceAccountNumber] });
      queryClient.invalidateQueries({ queryKey: ['transactions', variables.sourceAccountNumber] });
      // Also invalidate destination account if provided
      if (variables.destinationAccountNumber) {
        queryClient.invalidateQueries({ queryKey: ['account', 'balance', variables.destinationAccountNumber] });
        queryClient.invalidateQueries({ queryKey: ['transactions', variables.destinationAccountNumber] });
      }
      // Invalidate user profile to update accounts list in dashboard
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  }));
}
