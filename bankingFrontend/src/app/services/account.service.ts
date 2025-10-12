import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Account, AccountCreateRequest, AccountOperationRequest } from '../models/account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  constructor(private apiService: ApiService) {}

  async createAccount(account: AccountCreateRequest) {
    return await this.apiService.createAccount(account);
  }

  async deposit(accountId: string, amount: number) {
    return await this.apiService.deposit(accountId, amount);
  }

  async withdraw(accountId: string, amount: number) {
    return await this.apiService.withdraw(accountId, amount);
  }

  async getAccountBalance(accountNumber: string) {
    return await this.apiService.getAccountBalance(accountNumber);
  }

  async deleteAccount(accountId: string) {
    return await this.apiService.deleteAccount(accountId);
  }

  async getAccounts() {
    try {
      return await this.apiService.getAccounts();
    } catch (error) {
      throw error;
    }
  }

  async getTransactions(accountId: string) {
    return await this.apiService.getTransactions(accountId);
  }
}
