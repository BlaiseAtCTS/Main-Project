import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AccountService } from '../../services/account.service';
import { Account, AccountCreateRequest, AccountOperationRequest } from '../../models/account.model';

@Component({
  selector: 'app-accounts',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css'],
})
export class AccountsComponent implements OnInit {
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
  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;
  balanceResult: string = '';

  constructor(
    private authService: AuthService,
    private accountService: AccountService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
    // Clear any stale state
    this.clearMessages();
    this.isLoading = false;
  }

  setActiveTab(tab: 'create' | 'deposit' | 'withdraw' | 'balance' | 'delete'): void {
    this.activeTab = tab;
    this.clearMessages();
  }

  clearMessages(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.balanceResult = '';
  }

  async createAccount(): Promise<void> {
    try {
      this.isLoading = true;
      this.clearMessages();

      const response = await this.accountService.createAccount(this.newAccount);
      console.log('Create account response:', response);

      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success) {
          this.successMessage = response.message;
          this.newAccount = { accountNumber: '', initialBalance: 0, type: 'SAVINGS' };
        } else {
          this.errorMessage = response.message || 'Failed to create account';
        }
      } else {
        this.errorMessage = 'Invalid response from server';
      }
    } catch (error: any) {
      console.error('Create account error:', error);
      this.errorMessage = error.message || 'Failed to create account. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async depositAmount(): Promise<void> {
    try {
      this.isLoading = true;
      this.clearMessages();

      const response = await this.accountService.deposit(
        this.operationAccount.accountNumber,
        parseFloat(this.operationAccount.balance.toString())
      );
      console.log('Deposit response:', response);

      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success) {
          this.successMessage = response.message;
          this.operationAccount = { accountNumber: '', balance: 0 };
        } else {
          this.errorMessage = response.message || 'Failed to deposit amount';
        }
      } else {
        this.errorMessage = 'Invalid response from server';
      }
    } catch (error: any) {
      console.error('Deposit error:', error);
      this.errorMessage = error.message || 'Failed to deposit amount. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async withdrawAmount(): Promise<void> {
    try {
      this.isLoading = true;
      this.clearMessages();

      const response = await this.accountService.withdraw(
        this.operationAccount.accountNumber,
        parseFloat(this.operationAccount.balance.toString())
      );
      console.log('Withdraw response:', response);

      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success) {
          this.successMessage = response.message;
          this.operationAccount = { accountNumber: '', balance: 0 };
        } else {
          this.errorMessage = response.message || 'Failed to withdraw amount';
        }
      } else {
        this.errorMessage = 'Invalid response from server';
      }
    } catch (error: any) {
      console.error('Withdraw error:', error);
      this.errorMessage = error.message || 'Failed to withdraw amount. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async checkBalance(): Promise<void> {
    try {
      this.isLoading = true;
      this.clearMessages();

      const response = await this.accountService.getAccountBalance(this.balanceAccountNumber);
      console.log('Balance check response:', response);

      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success) {
          this.balanceResult = response.message;
          this.balanceAccountNumber = '';
        } else {
          this.errorMessage = response.message || 'Failed to retrieve balance';
        }
      } else {
        this.errorMessage = 'Invalid response from server';
      }
    } catch (error: any) {
      console.error('Balance check error:', error);
      this.errorMessage = error.message || 'Failed to check balance. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      this.isLoading = true;
      this.clearMessages();

      const response = await this.accountService.deleteAccount(this.operationAccount.accountNumber);
      console.log('Delete account response:', response);

      if (response && typeof response === 'object' && 'success' in response) {
        if (response.success) {
          this.successMessage = response.message;
          this.operationAccount = { accountNumber: '', balance: 0 };
        } else {
          this.errorMessage = response.message || 'Failed to delete account';
        }
      } else {
        this.errorMessage = 'Invalid response from server';
      }
    } catch (error: any) {
      console.error('Delete account error:', error);
      this.errorMessage = error.message || 'Failed to delete account. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
