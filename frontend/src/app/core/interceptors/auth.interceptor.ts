import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  const isApiUrl = req.url.startsWith('/') || !req.url.startsWith('http');
  const targetUrl = isApiUrl ? `${environment.apiUrl}${req.url.startsWith('/') ? '' : '/'}${req.url}` : req.url;

  const authReq = req.clone({
    url: targetUrl,
    withCredentials: true
  });


  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/login')) {
        authService.setAuthenticated(false);
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
