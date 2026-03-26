import { Routes } from '@angular/router';
import { authGuard, guestGuard } from './core/guards/auth.guard';

export const APP_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./features/pages/landing/landing.component').then(m => m.LandingComponent),
    title: 'CEOSmos - Deep Work Platform',
  },
  {
    path: '', // Maps to /login, /register, etc directly from auth.routes
    loadChildren: () =>
      import('./features/auth/auth.routes').then(m => m.AUTH_ROUTES),
    canActivate: [guestGuard]
  },
  {
    path: 'feed',
    loadComponent: () =>
      import('./features/pages/feed-page/feed-page.component').then(m => m.FeedPageComponent),
    title: 'CEOSmos - Flow Feed',
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./features/profile/profile.component').then(m => m.ProfileComponent),
    title: 'CEOSmos - Mi Perfil',
    canActivate: [authGuard]
  },
  {
    path: 'privacidad',
    loadComponent: () =>
      import('./features/pages/privacidad/privacidad.component').then(m => m.PrivacidadComponent),
    title: 'CEOSmos - Politica de Privacidad',
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
