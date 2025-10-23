import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AccountService } from '../../../services/account.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-create-account',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule],
  templateUrl: './create-account.component.html',
  styleUrl: './create-account.component.css',
})
export class CreateAccountComponent implements OnInit {
  createAccountForm!: FormGroup;
  loading = signal(false);
  success = signal<string | null>(null);
  error = signal<string | null>(null);
  accountTypes = ['SAVINGS', 'CHECKING', 'CREDIT'];

  constructor(
    private fb: FormBuilder,
    private accountService: AccountService,
    private authService: AuthService,
    private router: Router
  ) {}

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
      initialBalance: [1000, [Validators.required, Validators.min(100)]]
    });
  }

  onSubmit(): void {
    if (this.createAccountForm.invalid) {
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
        this.success.set('Account creation request submitted successfully! Waiting for admin approval.');
        this.createAccountForm.reset({ type: 'SAVINGS', initialBalance: 1000 });
        
        // Redirect to accounts page after 3 seconds
        setTimeout(() => {
          this.router.navigate(['/accounts']);
        }, 3000);
      },
      error: (err) => {
        console.error('Error creating account:', err);
        this.loading.set(false);
        this.error.set(err.error?.message || 'Failed to create account. Please try again.');
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
