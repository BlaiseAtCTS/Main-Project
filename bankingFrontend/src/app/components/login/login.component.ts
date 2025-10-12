import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserLoginRequest } from '../../models/user.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  loginData: UserLoginRequest = {
    userName: '',
    password: '',
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.isLoading = true;
    this.errorMessage = '';
    this.authService.login(this.loginData).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.router.navigate(['/accounts']);
        } else {
          this.errorMessage = response.message || 'Login failed. Please try again.';
        }
      },
      error: (error: any) => {
        if (error.message) {
          this.errorMessage = error.message;
        } else if (error.response?.data?.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'Login failed. Please try again.';
        }
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
