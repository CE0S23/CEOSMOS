import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { MessageService } from 'primeng/api';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const messageService = inject(MessageService);

  const isApiUrl = req.url.startsWith('/') || !req.url.startsWith('http');
  const targetUrl = isApiUrl ? `${environment.apiUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}` : req.url;

  const authReq = req.clone({
    url: targetUrl,
    withCredentials: true
  });


  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if ((error.status === 401 || error.status === 403) && !req.url.includes('/auth/login')) {
        authService.setAuthenticated(false);

        // Determine whether the user is already on an auth route to prevent
        // an infinite redirect loop: /login → guestGuard → getMe() → 401 → navigate(/login) → ...
        const currentUrl = router.url;
        const isAuthRoute =
          currentUrl.includes('/login') ||
          currentUrl.includes('/register') ||
          currentUrl.includes('/verify-email') ||
          currentUrl.includes('/forgot-password') ||
          currentUrl.includes('/reset-password');

        if (!isAuthRoute) {
          if (!req.url.includes('/users/me')) {
            messageService.add({ severity: 'error', summary: 'Sesión expirada', detail: 'Por favor inicia sesión nuevamente.' });
          }
          router.navigate(['/login']);
        }
      }
      return throwError(() => error);
    })
  );
};
