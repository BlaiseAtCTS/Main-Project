import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';
import { Account } from '../../models/account.model';
import { Transaction, TransferRequest } from '../../models/transaction.model';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './transactions.html',
  styleUrl: './transactions.css',
})
export class TransactionsComponent implements OnInit {
  // Account data
  accounts = signal<Account[]>([]);
  selectedAccount = signal<Account | null>(null);
  
  // Transaction history
  transactions = signal<Transaction[]>([]);
  filteredTransactions = signal<Transaction[]>([]);
  
  // Transfer form
  sourceAccountNumber = signal<string>('');
  destinationAccountNumber = signal<string>('');
  transferAmount = signal<number>(0);
  
  // UI state
  loading = signal(false);
  loadingTransactions = signal(false);
  error = signal<string | null>(null);
  success = signal<string | null>(null);
  searchTerm = signal<string>('');
  sortField = signal<string>('timestamp');
  sortDirection = signal<'asc' | 'desc'>('desc');
  
  // View state
  activeTab = signal<'transfer' | 'history'>('transfer');
  
  // Computed values for transaction summary
  totalDeposits = computed(() => {
    return this.filteredTransactions()
      .filter(t => t.type === 'Deposit')
      .reduce((sum, t) => sum + t.amount, 0);
  });
  
  totalWithdrawals = computed(() => {
    return this.filteredTransactions()
      .filter(t => t.type === 'Withdraw')
      .reduce((sum, t) => sum + t.amount, 0);
  });
  
  totalTransfers = computed(() => {
    return this.filteredTransactions()
      .filter(t => t.type === 'Transfer')
      .reduce((sum, t) => sum + t.amount, 0);
  });

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private transactionService: TransactionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.loadAccounts();
  }

  checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  loadAccounts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.accounts.set(profile.accounts || []);
        if (profile.accounts && profile.accounts.length > 0) {
          this.selectedAccount.set(profile.accounts[0]);
          this.sourceAccountNumber.set(profile.accounts[0].accountNumber);
          this.loadTransactions(profile.accounts[0].accountNumber);
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        this.error.set('Failed to load accounts. Please try again.');
        this.loading.set(false);
      }
    });
  }

  loadTransactions(accountNumber: string): void {
    this.loadingTransactions.set(true);
    this.error.set(null);

    this.transactionService.getTransactions({ accountNumber }).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.transactions.set(response.data as Transaction[]);
          this.applyFilters();
        }
        this.loadingTransactions.set(false);
      },
      error: (err) => {
        console.error('Error loading transactions:', err);
        this.error.set('Failed to load transactions. Please try again.');
        this.loadingTransactions.set(false);
      }
    });
  }

  onAccountChange(accountNumber: string): void {
    const account = this.accounts().find(a => a.accountNumber === accountNumber);
    if (account) {
      this.selectedAccount.set(account);
      this.sourceAccountNumber.set(accountNumber);
      this.loadTransactions(accountNumber);
    }
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.applyFilters();
  }

  applyFilters(): void {
    let filtered = [...this.transactions()];

    // Apply search filter
    const search = this.searchTerm().toLowerCase();
    if (search) {
      filtered = filtered.filter(t => 
        t.type.toLowerCase().includes(search) ||
        t.sourceAccountNumber.toLowerCase().includes(search) ||
        t.destinationAccountNumber.toLowerCase().includes(search) ||
        t.amount.toString().includes(search) ||
        (t.description?.toLowerCase().includes(search) ?? false)
      );
    }

    // Apply sorting
    const field = this.sortField();
    const direction = this.sortDirection();
    
    filtered.sort((a, b) => {
      let aVal: any = a[field as keyof Transaction];
      let bVal: any = b[field as keyof Transaction];
      
      if (field === 'timestamp') {
        aVal = new Date(aVal || 0).getTime();
        bVal = new Date(bVal || 0).getTime();
      }
      
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    this.filteredTransactions.set(filtered);
  }

  sortBy(field: string): void {
    if (this.sortField() === field) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortField.set(field);
      this.sortDirection.set('desc');
    }
    this.applyFilters();
  }

  onTransfer(): void {
    // Clear messages
    this.error.set(null);
    this.success.set(null);

    // Validate inputs
    if (!this.sourceAccountNumber()) {
      this.error.set('Please select a source account');
      return;
    }

    if (!this.destinationAccountNumber()) {
      this.error.set('Please enter a destination account number');
      return;
    }

    if (this.transferAmount() <= 0) {
      this.error.set('Transfer amount must be greater than 0');
      return;
    }

    if (this.sourceAccountNumber() === this.destinationAccountNumber()) {
      this.error.set('Source and destination accounts cannot be the same');
      return;
    }

    const sourceAccount = this.accounts().find(a => a.accountNumber === this.sourceAccountNumber());
    if (!sourceAccount) {
      this.error.set('Source account not found');
      return;
    }

    if (sourceAccount.balance < this.transferAmount()) {
      this.error.set('Insufficient balance in source account');
      return;
    }

    // Prepare transfer request
    const transferRequest: TransferRequest = {
      sourceAccountNumber: this.sourceAccountNumber(),
      destinationAccountNumber: this.destinationAccountNumber(),
      amount: this.transferAmount()
    };

    this.loading.set(true);

    this.transactionService.transfer(transferRequest).subscribe({
      next: (response) => {
        if (response.success) {
          this.success.set('Transfer completed successfully!');
          this.destinationAccountNumber.set('');
          this.transferAmount.set(0);
          
          // Reload accounts and transactions
          this.loadAccounts();
          
          // Switch to history tab to show the new transaction
          setTimeout(() => {
            this.activeTab.set('history');
          }, 1500);
        } else {
          this.error.set(response.message || 'Transfer failed. Please try again.');
        }
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error during transfer:', err);
        this.error.set(err.error?.message || 'Transfer failed. Please try again.');
        this.loading.set(false);
      }
    });
  }

  setActiveTab(tab: 'transfer' | 'history'): void {
    this.activeTab.set(tab);
  }

  formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  formatDate(date: string | undefined): string {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getTypeBadgeClass(type: string): string {
    switch (type) {
      case 'Deposit': return 'badge-success';
      case 'Withdraw': return 'badge-danger';
      case 'Transfer': return 'badge-primary';
      default: return 'badge-secondary';
    }
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
