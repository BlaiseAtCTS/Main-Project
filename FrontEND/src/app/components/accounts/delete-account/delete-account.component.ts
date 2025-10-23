import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { Account } from '../../../models/account.model';

@Component({
  selector: 'app-delete-account',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {
  deleteForm: FormGroup;
  accounts = signal<Account[]>([]);
  loadingAccounts = signal<boolean>(false);
  loading = signal<boolean>(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);
  showWarning = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {
    this.deleteForm = this.fb.group({
      accountNumber: ['', Validators.required],
      confirmation: ['', [Validators.required, Validators.pattern(/^DELETE$/)]]
    });
  }

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loadingAccounts.set(true);
    this.userService.getUserProfile().subscribe({
      next: (profile) => {
        this.accounts.set(profile.accounts || []);
        this.loadingAccounts.set(false);
      },
      error: (error) => {
        console.error('Error loading accounts:', error);
        this.error.set('Failed to load accounts. Please try again.');
        this.loadingAccounts.set(false);
      }
    });
  }

  onAccountSelect(): void {
    const selectedAccount = this.getSelectedAccount();
    this.showWarning.set(!!selectedAccount);
  }

  onSubmit(): void {
    if (this.deleteForm.invalid) {
      this.error.set('Please fill in all required fields correctly.');
      return;
    }

    const confirmationText = this.deleteForm.get('confirmation')?.value;
    if (confirmationText !== 'DELETE') {
      this.error.set('Please type "DELETE" to confirm account deletion.');
      return;
    }

    const selectedAccount = this.getSelectedAccount();
    if (!selectedAccount) {
      this.error.set('Please select an account.');
      return;
    }

    // Check if account has balance
    if (selectedAccount.balance > 0) {
      this.error.set(`Cannot delete account with remaining balance of ${this.formatCurrency(selectedAccount.balance)}. Please withdraw all funds first.`);
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const accountNumber = this.deleteForm.get('accountNumber')?.value;

    this.accountService.deleteAccount(accountNumber).subscribe({
      next: (response) => {
        this.success.set('Account deletion request submitted successfully! Admin approval is required.');
        this.loading.set(false);
        this.deleteForm.reset();
        this.showWarning.set(false);
        
        // Redirect to accounts page after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/accounts']);
        }, 3000);
      },
      error: (error) => {
        console.error('Delete account error:', error);
        this.error.set(error.error?.message || 'Failed to submit deletion request. Please try again.');
        this.loading.set(false);
      }
    });
  }

  getSelectedAccount(): Account | undefined {
    const accountNumber = this.deleteForm.get('accountNumber')?.value;
    return this.accounts().find(acc => acc.accountNumber === accountNumber);
  }

  formatCurrency(amount: number): string {
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
