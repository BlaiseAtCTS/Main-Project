import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRegisterRequest } from '../../models/user.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData: UserRegisterRequest = {
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    dob: '',
    address: ''
  };

  error: string | null = null;
  success: string | null = null;
  validationError: string | null = null;
  fieldError: string | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit(): void {
    this.error = null;
    this.success = null;
    this.validationError = null;
    this.fieldError = null;

    this.authService.register(this.registerData).subscribe({
      next: (response) => {
        if (response.success) {
          this.success = response.message || 'Registration successful! Redirecting to login...';
          this.cdr.detectChanges(); // Force change detection
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        } else {
          // Handle backend validation errors
          this.error = response.message || 'Registration failed';
          if (response.error) {
            this.validationError = response.error;
          }
          if (response.field) {
            this.fieldError = response.field;
          }
          this.cdr.detectChanges(); // Force change detection
        }
      },
      error: (error) => {
        console.error('Registration error:', error);
        
        // Handle different types of errors from backend
        if (error.error && typeof error.error === 'object') {
          // Handle structure: {error: 'Unauthorized', message: 'Authentication required'}
          this.error = error.error.message || 'Registration failed. Please try again.';
          if (error.error.error) {
            this.validationError = error.error.error;
          }
          if (error.error.field) {
            this.fieldError = error.error.field;
          }
        } else if (error.error && typeof error.error === 'string') {
          this.error = error.error;
        } else {
          this.error = error.message || 'Registration failed. Please try again.';
        }
        this.cdr.detectChanges(); // Force change detection
      }
    });
  }
}
