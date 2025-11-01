import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../services/user.service';
import { AuthService } from '../../services/auth.service';
import { UserProfile } from '../../models/user.model';
import { CardComponent, CardContentComponent, CardHeaderComponent, CardTitleComponent } from '../ui/card.component';
import { ButtonComponent } from '../ui/button.component';
import { SpinnerComponent } from '../ui/spinner.component';
import { AlertComponent } from '../ui/alert.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    CardComponent,
    CardHeaderComponent,
    CardTitleComponent,
    CardContentComponent,
    ButtonComponent,
    SpinnerComponent,
  AlertComponent
  ],
  templateUrl: './profile.html',
  styleUrls: ['./profile.css'],
})
export class ProfileComponent implements OnInit {
  profile = signal<UserProfile | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);
  isAdmin = signal(false);

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    this.isAdmin.set(this.authService.isAdmin());
    this.loadProfile();
  }

  checkAuthentication(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/login']);
    }
  }

  loadProfile(): void {
    this.loading.set(true);
    this.error.set(null);

    this.userService.getUserProfile().subscribe({
      next: (data) => {
        this.profile.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading profile:', error);
        this.error.set('Failed to load profile. Please try again.');
        this.loading.set(false);
      }
    });
  }

  formatCurrency(amount: number | null): string {
    if (amount === null) return 'N/A';
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  }

  getTotalBalance(): number {
    const prof = this.profile();
    if (!prof || !prof.accounts) return 0;
    return prof.accounts.reduce((sum: number, acc: any) => sum + (acc.balance || 0), 0);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
