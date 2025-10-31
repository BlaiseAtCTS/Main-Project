import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { Account } from '../../../models/account.model';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent } from '../../ui/card.component';
import { ButtonComponent } from '../../ui/button.component';
import { SpinnerComponent } from '../../ui/spinner.component';
import { AlertComponent } from '../../ui/alert.component';

@Component({
  selector: 'app-deposit',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    ButtonComponent,
    SpinnerComponent,
  AlertComponent
  ],
  templateUrl: './deposit.component.html',
  styleUrls: ['./deposit.component.css'],
})
export class DepositComponent implements OnInit {
  depositForm!: FormGroup;
  accounts = signal<Account[]>([]);
  loading = signal(false);
  loadingAccounts = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  constructor() {}

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
      this.toastService.error('Validation Error', 'Please fill in all fields correctly');
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
        this.toastService.success(
          'Deposit Successful',
          `Successfully deposited $${formValue.amount}! New balance will be reflected shortly.`
        );
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
        const errorMessage = err.error?.message || 'Failed to deposit. Please try again.';
        this.toastService.error('Deposit Failed', errorMessage);
        this.error.set(errorMessage);
      }
    });
  }

  getSelectedAccount(): Account | undefined {
    const accountNumber = this.depositForm.get('accountNumber')?.value;
    return this.accounts().find(acc => acc.accountNumber === accountNumber);
  }

  formatCurrency(amount: number | null): string {
    if (amount === null || amount === undefined) return '₹0.00';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
