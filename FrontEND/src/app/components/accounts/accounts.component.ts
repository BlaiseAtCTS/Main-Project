import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-accounts',
  imports: [CommonModule, RouterModule],
  templateUrl: './accounts.html',
  styleUrl: './accounts.css',
})
export class AccountsComponent implements OnInit {
  accounts = signal<Account[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  constructor(
    private userService: UserService,
    private authService: AuthService,
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
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        this.error.set('Failed to load accounts. Please try again.');
        this.loading.set(false);
      }
    });
  }

  formatCurrency(amount: number | null): string {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  getAccountTypeIcon(type: string): string {
    switch (type?.toUpperCase()) {
      case 'SAVINGS': return 'fas fa-piggy-bank';
      case 'CHECKING': return 'fas fa-wallet';
      case 'CREDIT': return 'fas fa-credit-card';
      default: return 'fas fa-university';
    }
  }

  getTotalBalance(): number {
    return this.accounts().reduce((sum, acc) => sum + (acc.balance || 0), 0);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
