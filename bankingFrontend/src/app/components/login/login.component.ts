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
      new Promise<any>((resolve, reject) => {
        this.authService.login(credentials).subscribe({
          next: (response) => resolve(response),
          error: (error) => reject(error),
        });
      }),
    onSuccess: (data) => {
      console.log('✅ Login response:', data);

      if (data.success) {
        // Clear any old data first
        localStorage.clear();
        sessionStorage.clear();
        
        // Save token
        localStorage.setItem('token', data.token);

        // Determine role — from response or from token payload
        const role = data.role || this.decodeRoleFromToken(data.token);
        console.log('👤 Detected role:', role);
        console.log('🎫 Token saved:', data.token.substring(0, 20) + '...');
        localStorage.setItem('role', role);

        console.log('💾 Stored in localStorage:', {
          hasToken: !!localStorage.getItem('token'),
          role: localStorage.getItem('role')
        });

        // Small delay to ensure storage is updated
        setTimeout(() => {
          // Redirect based on role
          if (role === 'ADMIN') {
            console.log('🔄 Redirecting to admin dashboard...');
            this.router.navigate(['/admin/dashboard']);
          } else {
            console.log('🔄 Redirecting to user dashboard...');
            this.router.navigate(['/dashboard']);
          }
        }, 100);
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

  // Helper to decode role if backend doesn't return it directly
  private decodeRoleFromToken(token: string): string {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || 'USER';
    } catch {
      return 'USER';
    }
  }
}
