import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MessageService } from 'primeng/api';

export const adminGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const messageService = inject(MessageService);

  try {
    const user = authService.user() || await authService.getMe();
    
    if (user && user.role === 'ADMIN') {
      return true;
    } else {
      messageService.add({ severity: 'error', summary: 'Acceso Denegado', detail: 'No tienes permisos de administrador.' });
      return router.parseUrl('/home');
    }
  } catch {
    messageService.add({ severity: 'error', summary: 'Error', detail: 'Debe iniciar sesión primero.' });
    return router.parseUrl('/login');
  }
};
