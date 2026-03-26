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

  // Otherwise, try to fetch the session cookie to see if it's still valid
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

  // Fast path: already authenticated in memory → redirect away
  if (authService.isAuthenticated()) {
    return router.parseUrl('/');
  }

  // Try to validate the session cookie. If it succeeds the user is
  // still logged in and should be sent to the app, not to /login.
  try {
    await authService.getMe();
    return router.parseUrl('/');
  } catch {
    // No valid session → allow access to this auth route
    return true;
  }
};
