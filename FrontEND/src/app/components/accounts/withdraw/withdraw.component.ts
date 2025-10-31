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
  selector: 'app-withdraw',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    ButtonComponent,
    SpinnerComponent,
  AlertComponent
  ],
  templateUrl: './withdraw.component.html',
  styleUrls: ['./withdraw.component.css']
})
export class WithdrawComponent implements OnInit {
  withdrawForm: FormGroup;
  accounts = signal<Account[]>([]);
  loadingAccounts = signal<boolean>(false);
  loading = signal<boolean>(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  constructor() {
    this.withdrawForm = this.fb.group({
      accountNumber: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(1)]]
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

  onSubmit(): void {
    if (this.withdrawForm.invalid) {
      this.toastService.error('Validation Error', 'Please fill in all required fields correctly.');
      this.error.set('Please fill in all required fields correctly.');
      return;
    }

    // Validate withdrawal amount against account balance
    const selectedAccount = this.getSelectedAccount();
    const withdrawAmount = this.withdrawForm.get('amount')?.value || 0;
    
    if (!selectedAccount) {
      this.toastService.error('Validation Error', 'Please select an account.');
      this.error.set('Please select an account.');
      return;
    }

    if (withdrawAmount > selectedAccount.balance) {
      const errorMsg = `Insufficient funds. Current balance is ${this.formatCurrency(selectedAccount.balance)}`;
      this.toastService.error('Insufficient Funds', errorMsg);
      this.error.set(errorMsg);
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const formValue = {
      accountNumber: this.withdrawForm.get('accountNumber')?.value,
      amount: withdrawAmount
    };

    this.accountService.withdraw(formValue).subscribe({
      next: (response) => {
        const successMsg = `Successfully withdrew ${this.formatCurrency(withdrawAmount)} from your account!`;
        this.toastService.success('Withdrawal Successful', successMsg);
        this.success.set(successMsg);
        this.loading.set(false);
        this.withdrawForm.reset();
        
        // Reload accounts to show updated balance
        setTimeout(() => {
          this.loadAccounts();
        }, 1000);
      },
      error: (error) => {
        console.error('Withdrawal error:', error);
        const errorMsg = error.error?.message || 'Failed to process withdrawal. Please try again.';
        this.toastService.error('Withdrawal Failed', errorMsg);
        this.error.set(errorMsg);
        this.loading.set(false);
      }
    });
  }

  getSelectedAccount(): Account | undefined {
    const accountNumber = this.withdrawForm.get('accountNumber')?.value;
    return this.accounts().find(acc => acc.accountNumber === accountNumber);
  }

  formatCurrency(amount: number): string {
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
