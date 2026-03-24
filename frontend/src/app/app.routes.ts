import { Routes } from '@angular/router';

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
    path: 'login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then(m => m.LoginComponent),
    title: 'CEOSmos - Iniciar Sesion',
  },
  {
    path: 'feed',
    loadComponent: () =>
      import('./features/pages/feed-page/feed-page.component').then(m => m.FeedPageComponent),
    title: 'CEOSmos - Flow Feed',
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
