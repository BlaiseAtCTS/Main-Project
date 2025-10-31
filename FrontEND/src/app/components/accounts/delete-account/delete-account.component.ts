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
import { 
  AlertDialogComponent, 
  AlertDialogHeaderComponent, 
  AlertDialogTitleComponent,
  AlertDialogDescriptionComponent,
  AlertDialogContentComponent,
  AlertDialogFooterComponent 
} from '../../ui/alert-dialog.component';

@Component({
  selector: 'app-delete-account',
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
    AlertComponent,
    AlertDialogComponent,
    AlertDialogHeaderComponent,
    AlertDialogTitleComponent,
    AlertDialogDescriptionComponent,
    AlertDialogContentComponent,
    AlertDialogFooterComponent
  ],
  templateUrl: './delete-account.component.html',
  styleUrls: ['./delete-account.component.css']
})
export class DeleteAccountComponent implements OnInit {
  deleteForm: FormGroup;
  accounts = signal<Account[]>([]);
  showDeleteDialog = signal<boolean>(false);
  loadingAccounts = signal<boolean>(false);
  loading = signal<boolean>(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);
  showWarning = signal<boolean>(false);

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  constructor() {
    this.deleteForm = this.fb.group({
      accountNumber: ['', Validators.required]
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

  openDeleteDialog(): void {
    if (this.deleteForm.invalid) {
      this.toastService.error('Validation Error', 'Please select an account to delete.');
      return;
    }

    const selectedAccount = this.getSelectedAccount();
    if (!selectedAccount) {
      this.toastService.error('Validation Error', 'Please select an account.');
      return;
    }

    // Check if account has balance
    if (selectedAccount.balance > 0) {
      const errorMsg = `Cannot delete account with remaining balance of ${this.formatCurrency(selectedAccount.balance)}. Please withdraw all funds first.`;
      this.toastService.warning('Balance Remaining', errorMsg);
      return;
    }

    this.showDeleteDialog.set(true);
  }

  cancelDelete(): void {
    this.showDeleteDialog.set(false);
  }

  confirmDelete(): void {
    this.showDeleteDialog.set(false);
    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const accountNumber = this.deleteForm.get('accountNumber')?.value;

    this.accountService.deleteAccount(accountNumber).subscribe({
      next: (response) => {
        const successMsg = 'Account deletion request submitted successfully! Admin approval is required.';
        this.toastService.success('Deletion Request Submitted', successMsg);
        this.success.set(successMsg);
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
        const errorMsg = error.error?.message || 'Failed to submit deletion request. Please try again.';
        this.toastService.error('Deletion Failed', errorMsg);
        this.error.set(errorMsg);
        this.loading.set(false);
      }
    });
  }

  getSelectedAccount(): Account | undefined {
    const accountNumber = this.deleteForm.get('accountNumber')?.value;
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
