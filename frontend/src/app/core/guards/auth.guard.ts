import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

const AUTH_PATHS = ['/login', '/register', '/verify-email', '/forgot-password', '/reset-password'];

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

  // If the user is already on an auth route, skip the network check entirely.
  // Without this, navigating to /login would fire getMe() → 401 → interceptor
  // redirects back to /login → guestGuard fires again → infinite loop.
  const isAlreadyOnAuthRoute = AUTH_PATHS.some(p => router.url.includes(p));
  if (isAlreadyOnAuthRoute) {
    return true;
  }

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
