import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardContentComponent } from '../../ui/card.component';
import { ButtonComponent } from '../../ui/button.component';
import { AlertComponent } from '../../ui/alert.component';
import { SpinnerComponent } from '../../ui/spinner.component';

@Component({
  selector: 'app-create-account',
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
    AlertComponent,
  SpinnerComponent
  ],
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
})
export class CreateAccountComponent implements OnInit {
  createAccountForm!: FormGroup;
  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);
  accountTypes = ['SAVINGS', 'CHECKING', 'CREDIT'];

  private fb = inject(FormBuilder);
  private accountService = inject(AccountService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastService = inject(ToastService);

  constructor() {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.initializeForm();
  }

  checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  initializeForm(): void {
    this.createAccountForm = this.fb.group({
      type: ['SAVINGS', Validators.required],
      initialBalance: [1000, [Validators.required, Validators.min(1000)]]
    });
  }

  onSubmit(): void {
    if (this.createAccountForm.invalid) {
      this.toastService.error('Validation Error', 'Please fill in all fields correctly');
      this.error.set('Please fill in all fields correctly');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.success.set(null);

    const formValue = this.createAccountForm.value;
    
    this.accountService.createAccount(formValue).subscribe({
      next: (response) => {
        this.loading.set(false);
        const successMsg = 'Account creation request submitted successfully! Redirecting to view your request status...';
        this.toastService.success('Account Request Submitted', successMsg);
        this.success.set(successMsg);
        this.createAccountForm.reset({ type: 'SAVINGS', initialBalance: 1000 });
        
        // Redirect to account requests page after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/account-requests']);
        }, 2000);
      },
      error: (err) => {
        console.error('Error creating account:', err);
        this.loading.set(false);
        const errorMsg = err.error?.message || 'Failed to create account. Please try again.';
        this.toastService.error('Account Creation Failed', errorMsg);
        this.error.set(errorMsg);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
