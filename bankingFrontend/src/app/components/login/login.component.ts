import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { UserLoginRequest } from '../../models/user.model';
import { injectMutation } from '@tanstack/angular-query-experimental';

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

  constructor(private authService: AuthService, private router: Router) {}

  protected loginMutation = injectMutation(() => ({
    mutationFn: (credentials: UserLoginRequest) =>
      new Promise<any>((resolve) => {
        this.authService.login(credentials).subscribe({
          next: (response) => resolve(response),
          error: (error) => {
            throw error;
          },
        });
      }),
    onSuccess: (data) => {
      if (data.success) {
        this.router.navigate(['/accounts']);
      }
    },
  }));

  onSubmit(event?: Event): void {
    if (event) {
      event.preventDefault();
    }
    this.loginMutation.mutate(this.loginData);
  }

  navigateToRegister(): void {
    this.router.navigate(['/register']);
  }
}
