import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './deposit.component.html',
  styleUrl: './deposit.component.css',
})
export class DepositComponent implements OnInit {
  depositForm!: FormGroup;
  accounts = signal<Account[]>([]);
  loading = signal(false);
  loadingAccounts = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.initializeForm();
    this.loadAccounts();
  }

  checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  initializeForm(): void {
    this.depositForm = this.fb.group({
      accountNumber: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]]
    });
  }

  loadAccounts(): void {
    this.loadingAccounts.set(true);
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.accounts.set(profile.accounts || []);
        this.loadingAccounts.set(false);
      },
      error: (err) => {
        console.error('Error loading accounts:', err);
        this.error.set('Failed to load accounts');
        this.loadingAccounts.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.depositForm.invalid) {
      this.error.set('Please fill in all fields correctly');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const formValue = this.depositForm.value;
    
    this.accountService.deposit(formValue).subscribe({
      next: (response) => {
        this.loading.set(false);
        this.success.set(`Successfully deposited $${formValue.amount}! New balance will be reflected shortly.`);
        this.depositForm.reset();
        
        // Reload accounts to show updated balance
        setTimeout(() => {
          this.loadAccounts();
        }, 1000);
      },
      error: (err) => {
        console.error('Error depositing:', err);
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to deposit. Please try again.');
      }
    });
  }

  getSelectedAccount(): Account | undefined {
    const accountNumber = this.depositForm.get('accountNumber')?.value;
    return this.accounts().find(acc => acc.accountNumber === accountNumber);
  }

  formatCurrency(amount: number | null): string {
    if (amount === null || amount === undefined) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
