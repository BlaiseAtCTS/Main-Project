import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleBasedRedirectGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Redirect admin users to admin dashboard
  if (authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  // Redirect regular users to user dashboard
  router.navigate(['/dashboard']);
  return false;
};
