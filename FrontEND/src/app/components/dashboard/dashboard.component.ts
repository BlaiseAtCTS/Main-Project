import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { TransactionService } from '../../services/transaction.service';
import { AuthService } from '../../services/auth.service';
import { Account } from '../../models/account.model';
import { Transaction } from '../../models/transaction.model';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
  accounts = signal<Account[]>([]);
  recentTransactions = signal<Transaction[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);
  totalBalance = signal(0);
  activeAccounts = signal(0);
  username = signal('');

  constructor(
    private userService: UserService,
    private transactionService: TransactionService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadDashboardData();
  }

  checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  loadDashboardData(): void {
    this.loading.set(true);
    this.error.set(null);

    // Load user profile (includes accounts)
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.accounts.set(profile.accounts || []);
        this.username.set(profile.username);
        this.calculateStats();
        this.loadRecentTransactions();
      },
      error: (err) => {
        console.error('Error loading profile:', err);
        this.error.set('Failed to load dashboard data. Please try again.');
        this.loading.set(false);
      }
    });
  }

  loadRecentTransactions(): void {
    const accs = this.accounts();
    if (accs.length === 0) {
      this.loading.set(false);
      return;
    }

    // Load transactions from the first account (or you can load from all and combine)
    const firstAccount = accs[0];
    this.transactionService.getTransactions({ accountNumber: firstAccount.accountNumber }).subscribe({
      next: (response) => {
        const transactions = response.data as Transaction[];
        if (transactions && Array.isArray(transactions)) {
          // Get last 5 transactions
          const sorted = [...transactions].sort((a, b) => {
            if (a.timestamp && b.timestamp) {
              return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }
            return 0;
          });
          this.recentTransactions.set(sorted.slice(0, 5));
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.loading.set(false);
      }
    });
  }

  calculateStats(): void {
    const accs = this.accounts();
    const total = accs.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    this.totalBalance.set(total);
    this.activeAccounts.set(accs.length);
  }

  formatCurrency(amount: number | null): string {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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
      case 'DEPOSIT': return 'fas fa-arrow-down text-success';
      case 'WITHDRAWAL': return 'fas fa-arrow-up text-danger';
      case 'TRANSFER': return 'fas fa-exchange-alt text-primary';
      default: return 'fas fa-dollar-sign text-muted';
    }
  }

  getAccountTypeIcon(type: string): string {
    switch (type?.toUpperCase()) {
      case 'SAVINGS': return 'fas fa-piggy-bank';
      case 'CHECKING': return 'fas fa-wallet';
      case 'CREDIT': return 'fas fa-credit-card';
      default: return 'fas fa-university';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
