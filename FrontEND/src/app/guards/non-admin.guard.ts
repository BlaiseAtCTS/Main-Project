import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const nonAdminGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If user is authenticated but is an admin, redirect to admin dashboard
  if (authService.isAuthenticated() && authService.isAdmin()) {
    router.navigate(['/admin/dashboard']);
    return false;
  }

  // Allow access if user is authenticated and not an admin
  if (authService.isAuthenticated()) {
    return true;
  }

  // If not authenticated at all, redirect to login
  router.navigate(['/login']);
  return false;
};
