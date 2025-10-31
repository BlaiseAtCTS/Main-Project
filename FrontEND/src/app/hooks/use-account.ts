import { inject } from '@angular/core';
import { injectMutation, injectQuery, injectQueryClient } from '@tanstack/angular-query-experimental';
import { AccountService } from '../services/account.service';
import { AccountCreateRequest, AccountOperationRequest } from '../models/account.model';
import { lastValueFrom } from 'rxjs';

/**
 * TanStack Query hook for account balance
 */
export function useAccountBalance(accountNumber: string) {
  const accountService = inject(AccountService);
  
  return injectQuery(() => ({
    queryKey: ['account', 'balance', accountNumber],
    queryFn: async () => {
      return await lastValueFrom(accountService.getBalance(accountNumber));
    },
    enabled: !!accountNumber,
    staleTime: 1000 * 30, // 30 seconds
  }));
}

/**
 * TanStack Query hook for deposit operation
 */
export function useDeposit() {
  const accountService = inject(AccountService);
  const queryClient = injectQueryClient();
  
  return injectMutation(() => ({
    mutationKey: ['account', 'deposit'],
    mutationFn: async (data: AccountOperationRequest) => {
      console.log('💰 Depositing to account:', data.accountNumber);
      return await lastValueFrom(accountService.deposit(data));
    },
    onSuccess: (_, variables) => {
      console.log('✅ Deposit successful, invalidating queries...');
      // Invalidate balance query to refetch updated balance
      queryClient.invalidateQueries({ queryKey: ['account', 'balance', variables.accountNumber] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // Invalidate user profile to update accounts list in dashboard
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  }));
}

/**
 * TanStack Query hook for withdraw operation
 */
export function useWithdraw() {
  const accountService = inject(AccountService);
  const queryClient = injectQueryClient();
  
  return injectMutation(() => ({
    mutationKey: ['account', 'withdraw'],
    mutationFn: async (data: AccountOperationRequest) => {
      console.log('💸 Withdrawing from account:', data.accountNumber);
      return await lastValueFrom(accountService.withdraw(data));
    },
    onSuccess: (_, variables) => {
      console.log('✅ Withdrawal successful, invalidating queries...');
      queryClient.invalidateQueries({ queryKey: ['account', 'balance', variables.accountNumber] });
      queryClient.invalidateQueries({ queryKey: ['transactions'] });
      // Invalidate user profile to update accounts list in dashboard
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  }));
}

/**
 * TanStack Query hook for creating account
 */
export function useCreateAccount() {
  const accountService = inject(AccountService);
  const queryClient = injectQueryClient();
  
  return injectMutation(() => ({
    mutationKey: ['account', 'create'],
    mutationFn: async (data: AccountCreateRequest) => {
      return await lastValueFrom(accountService.createAccount(data));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      // Invalidate user profile to update accounts list in dashboard
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  }));
}

/**
 * TanStack Query hook for generating account number
 */
export function useGenerateAccountNumber() {
  const accountService = inject(AccountService);
  
  return injectMutation(() => ({
    mutationKey: ['account', 'generate-number'],
    mutationFn: async (type: string) => {
      return await lastValueFrom(accountService.generateAccountNumber(type));
    }
  }));
}

/**
 * TanStack Query hook for deleting account
 */
export function useDeleteAccount() {
  const accountService = inject(AccountService);
  const queryClient = injectQueryClient();
  
  return injectMutation(() => ({
    mutationKey: ['account', 'delete'],
    mutationFn: async (accountNumber: string) => {
      return await lastValueFrom(accountService.deleteAccount(accountNumber));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['accounts'] });
      // Invalidate user profile to update accounts list in dashboard
      queryClient.invalidateQueries({ queryKey: ['user', 'profile'] });
    }
  }));
}
