import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { useAuth, useLogout } from '../../hooks/use-auth';
import { ButtonComponent } from '../ui/button.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class NavbarComponent {
  auth = useAuth();
  logoutMutation = useLogout();
  mobileMenuOpen = signal(false);

  constructor(private router: Router) {}

  logout(): void {
    this.logoutMutation.mutate(undefined, {
      onSuccess: () => {
        this.router.navigate(['/login']);
      }
    });
  }

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(v => !v);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  get isAuthenticated(): boolean {
    const authData = this.auth.data();
    return authData?.isAuthenticated || false;
  }

  get isAdmin(): boolean {
    const authData = this.auth.data();
    return authData?.isAdmin || false;
  }
}
