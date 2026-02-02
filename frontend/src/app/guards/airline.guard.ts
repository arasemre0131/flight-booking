// Airline Role Guard - 011-airline-dashboard

import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const airlineGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if user is authenticated
  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Check if user has airline role
  const user = authService.currentUser();
  if (!user || user.role !== 'airline') {
    // Redirect to home if wrong role
    router.navigate(['/']);
    return false;
  }

  return true;
};
