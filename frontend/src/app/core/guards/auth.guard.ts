import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  const token = localStorage.getItem('token');
  if (!token) {
    return router.parseUrl('/login');
  }

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

  const token = localStorage.getItem('token');
  if (!token) {
    return true;
  }

  try {
    await authService.getMe();
    return router.parseUrl('/');
  } catch {
    return true;
  }
};
