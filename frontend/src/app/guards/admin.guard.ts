// Admin Route Guard - 012-admin-panel

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Check if user has admin role
  const user = authService.currentUser();
  if (!user || user.role !== 'admin') {
    // Redirect to home if wrong role
    router.navigate(['/']);
    return false;
  }

  return true;
};
