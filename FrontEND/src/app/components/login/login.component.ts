import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserLoginRequest } from '../../models/user.model';
import { useLogin } from '../../hooks/use-auth';
import { ToastService } from '../../services/toast.service';
import { ButtonComponent } from '../ui/button.component';
import { InputComponent } from '../ui/input.component';
import { CardComponent, CardHeaderComponent, CardTitleComponent, CardDescriptionComponent, CardContentComponent, CardFooterComponent } from '../ui/card.component';
import { LabelComponent } from '../ui/label.component';
import { SpinnerComponent } from '../ui/spinner.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    ButtonComponent,
    InputComponent,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardDescriptionComponent,
    CardContentComponent,
    CardFooterComponent,
    LabelComponent,
    SpinnerComponent,
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  private router = inject(Router);
  private toastService = inject(ToastService);
  
  loginData: UserLoginRequest = {
    userName: '',
    password: ''
  };

  loginMutation = useLogin();

  onSubmit(): void {
    if (!this.loginData.userName || !this.loginData.password) {
      this.toastService.error('Validation Error', 'Please fill in all fields');
      return;
    }

    this.loginMutation.mutate(this.loginData, {
      onSuccess: (response) => {
        if (response.success) {
          const role = response.role || 'USER';
          const userName = response.username || this.loginData.userName;
          this.toastService.success('Login Successful', `Welcome back, ${userName}!`);
          
          if (role === 'ADMIN') {
            this.router.navigate(['/admin/dashboard']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.toastService.error('Login Failed', response.message || 'Invalid credentials');
        }
      },
      onError: (error: any) => {
        const errorMessage = error.error?.message || 'Login failed. Please try again.';
        this.toastService.error('Login Error', errorMessage);
      }
    });
  }

  get isPending(): boolean {
    return this.loginMutation.isPending();
  }
}
