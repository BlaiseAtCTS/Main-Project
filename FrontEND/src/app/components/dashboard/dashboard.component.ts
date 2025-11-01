import { Component, computed, signal, effect, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { injectQuery } from '@tanstack/angular-query-experimental';
import { useUserProfile } from '../../hooks/use-user';
import { useLogout } from '../../hooks/use-auth';
import { TransactionService } from '../../services/transaction.service';
import { Account } from '../../models/account.model';
import { Transaction } from '../../models/transaction.model';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../ui/card.component';
import { ButtonComponent } from '../ui/button.component';
import { SpinnerComponent } from '../ui/spinner.component';
import { AlertComponent } from '../ui/alert.component';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    ButtonComponent,
    SpinnerComponent,
    AlertComponent
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent {
  private transactionService = inject(TransactionService);
  
  profileQuery = useUserProfile();
  selectedAccountNumber = signal<string | null>(null);
  
  // Create reactive transactions query based on selected account
  transactionsQuery = injectQuery(() => ({
    queryKey: ['transactions', this.selectedAccountNumber()],
    queryFn: async () => {
      const accountNumber = this.selectedAccountNumber();
      if (!accountNumber) return [];
      return await lastValueFrom(
        this.transactionService.getTransactions({ accountNumber })
      );
    },
    enabled: !!this.selectedAccountNumber(),
    staleTime: 1000 * 60 * 2, // 2 minutes
  }));
  
  logoutMutation = useLogout();

  constructor(private router: Router) {
    // Use effect to reactively set initial account when profile loads
    effect(() => {
      const profileData = this.profileQuery.data();
      if (profileData?.accounts && profileData.accounts.length > 0 && !this.selectedAccountNumber()) {
        this.selectedAccountNumber.set(profileData.accounts[0].accountNumber);
      }
    });
  }

  // Computed values
  accounts = computed(() => this.profileQuery.data()?.accounts || []);
  username = computed(() => this.profileQuery.data()?.username || '');
  totalBalance = computed(() => 
    this.accounts().reduce((sum, acc) => sum + (acc.balance || 0), 0)
  );
  activeAccounts = computed(() => this.accounts().length);
  
  // Get recent transactions from the query
  recentTransactions = computed(() => {
    const data = this.transactionsQuery.data();
    if (!data || !Array.isArray(data)) return [] as Transaction[];
    
    // Get last 5 transactions sorted by timestamp
    const sorted = [...data].sort((a: Transaction, b: Transaction) => {
      if (a.timestamp && b.timestamp) {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      }
      return 0;
    });
    return sorted.slice(0, 5);
  });

  selectedAccount = computed(() => {
    const accountNumber = this.selectedAccountNumber();
    return this.accounts().find(a => a.accountNumber === accountNumber) || null;
  });

  isLoading = computed(() => this.profileQuery.isPending());
  isTransactionsLoading = computed(() => this.transactionsQuery.isPending());

  onAccountChangeForTransactions(accountNumber: string): void {
    this.selectedAccountNumber.set(accountNumber);
  }

  logout(): void {
    this.logoutMutation.mutate(undefined, {
      onSuccess: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  formatCurrency(amount: number | null): string {
    if (amount === null || amount === undefined) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTransactionIcon(type: string): string {
    switch (type?.toUpperCase()) {
      case 'DEPOSIT': return 'arrow-down';
      case 'WITHDRAWAL': return 'arrow-up';
      case 'TRANSFER': return 'arrow-right-arrow-left';
      default: return 'dollar-sign';
    }
  }

  getAccountTypeIcon(type: string): string {
    switch (type?.toUpperCase()) {
      case 'SAVINGS': return 'piggy-bank';
      case 'CHECKING': return 'wallet';
      case 'CREDIT': return 'credit-card';
      default: return 'building-columns';
    }
  }

  getTransactionTypeColor(type: string): 'success' | 'destructive' | 'default' {
    switch (type?.toUpperCase()) {
      case 'DEPOSIT': return 'success';
      case 'WITHDRAWAL': return 'destructive';
      default: return 'default';
    }
  }
}
