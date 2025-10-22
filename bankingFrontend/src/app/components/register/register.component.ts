import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserRegisterRequest } from '../../models/user.model';
import { injectMutation } from '@tanstack/angular-query-experimental';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerData: UserRegisterRequest = {
    userName: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: null,
    dob: '',
    address: '',
  };

  confirmPassword: string = '';
  protected passwordError: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  protected registerMutation = injectMutation(() => ({
    mutationFn: async (data: UserRegisterRequest) => {
      const response = await firstValueFrom(this.authService.register(data));
      if (!response.success) {
        throw new Error(response.message || 'Registration failed. Please try again.');
      }
      return response;
    },
    onSuccess: (data) => {
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 2000);
    },
  }));

  onSubmit(): void {
    if (this.registerData.password !== this.confirmPassword) {
      this.passwordError = 'Passwords do not match';
      return;
    }
    this.passwordError = null;
    this.registerMutation.mutate(this.registerData);
  }

  navigateToLogin(): void {
    this.router.navigate(['/login']);
  }
}
