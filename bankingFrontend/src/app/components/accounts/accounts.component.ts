import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { Account, AccountCreateRequest, AccountOperationRequest } from '../../models/account.model';
import { injectMutation } from '@tanstack/angular-query-experimental';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent {
  // Account creation
  newAccount: AccountCreateRequest = {
    accountNumber: '',
    initialBalance: 0,
    type: 'SAVINGS',
  };

  // Account operations
  operationAccount: AccountOperationRequest = {
    accountNumber: '',
    balance: 0,
  };

  // Balance check
  balanceAccountNumber: string = '';

  // UI state
  activeTab: 'create' | 'deposit' | 'withdraw' | 'balance' | 'delete' = 'create';
  balanceResult: string = '';

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router
  ) {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  protected createAccountMutation = injectMutation(() => ({
    mutationFn: (account: AccountCreateRequest) => this.accountService.createAccount(account),
  }));

  protected depositMutation = injectMutation(() => ({
    mutationFn: (data: AccountOperationRequest) =>
      this.accountService.deposit(data.accountNumber, data.balance),
  }));

  protected withdrawMutation = injectMutation(() => ({
    mutationFn: (data: AccountOperationRequest) =>
      this.accountService.withdraw(data.accountNumber, data.balance),
  }));

  protected balanceMutation = injectMutation(() => ({
    mutationFn: (accountNumber: string) => this.accountService.getAccountBalance(accountNumber),
  }));

  protected deleteAccountMutation = injectMutation(() => ({
    mutationFn: (accountNumber: string) => this.accountService.deleteAccount(accountNumber),
  }));

  setActiveTab(tab: 'create' | 'deposit' | 'withdraw' | 'balance' | 'delete'): void {
    this.activeTab = tab;
    this.balanceResult = '';

    // Reset mutations
    this.createAccountMutation.reset();
    this.depositMutation.reset();
    this.withdrawMutation.reset();
    this.balanceMutation.reset();
    this.deleteAccountMutation.reset();
  }

  createAccount(): void {
    this.createAccountMutation.mutate(this.newAccount, {
      onSuccess: (response) => {
        if (response.success) {
          this.newAccount = { accountNumber: '', initialBalance: 0, type: 'SAVINGS' };
        } else {
          throw new Error(response.message || 'Failed to create account');
        }
      },
      onError: (error: Error) => {
        console.error('Create account error:', error);
      },
    });
  }

  depositAmount(): void {
    this.depositMutation.mutate(this.operationAccount, {
      onSuccess: (response) => {
        if (response.success) {
          this.operationAccount = { accountNumber: '', balance: 0 };
        } else {
          throw new Error(response.message || 'Failed to deposit amount');
        }
      },
      onError: (error: Error) => {
        console.error('Deposit error:', error);
      },
    });
  }

  withdrawAmount(): void {
    this.withdrawMutation.mutate(this.operationAccount, {
      onSuccess: (response) => {
        if (response.success) {
          this.operationAccount = { accountNumber: '', balance: 0 };
        } else {
          throw new Error(response.message || 'Failed to withdraw amount');
        }
      },
      onError: (error: Error) => {
        console.error('Withdraw error:', error);
      },
    });
  }

  checkBalance(): void {
    this.balanceMutation.mutate(this.balanceAccountNumber, {
      onSuccess: (response) => {
        if (response.success) {
          this.balanceResult = response.message;
          this.balanceAccountNumber = '';
        } else {
          throw new Error(response.message || 'Failed to retrieve balance');
        }
      },
      onError: (error: Error) => {
        console.error('Balance check error:', error);
      },
    });
  }

  deleteAccount(): void {
    this.deleteAccountMutation.mutate(this.operationAccount.accountNumber, {
      onSuccess: (response) => {
        if (response.success) {
          this.operationAccount = { accountNumber: '', balance: 0 };
        } else {
          throw new Error(response.message || 'Failed to delete account');
        }
      },
      onError: (error: Error) => {
        console.error('Delete account error:', error);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
