import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // If already marked as authenticated, pass
  if (authService.isAuthenticated()) {
    return true;
  }

  // Otherwise, try to fetch me to see if cookie is valid
  try {
    await authService.getMe();
    return true;
  } catch {
    return router.parseUrl('/login');
  }
};

export const guestGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return router.parseUrl('/');
  }

  try {
    await authService.getMe();
    return router.parseUrl('/');
  } catch {
    return true;
  }
};
