import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  let user = authService.user();

  if (!user) {
    const token = localStorage.getItem('token');
    if (!token) return router.parseUrl('/login');
    try {
      user = await authService.getMe();
    } catch {
      return router.parseUrl('/login');
    }
  }

  if (user.role !== 'ADMIN') {
    return router.parseUrl('/feed');
  }

  return true;
};
