import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { guestGuard } from '../../core/guards/auth.guard';

export const AUTH_ROUTES: Routes = [
  { path: 'login',            component: LoginComponent,          canActivate: [guestGuard] },
  { path: 'register',         component: RegisterComponent,       canActivate: [guestGuard] },
  { path: 'verify-email',     component: VerifyEmailComponent,    canActivate: [guestGuard] },
  { path: 'forgot-password',  component: ForgotPasswordComponent, canActivate: [guestGuard] },
  { path: 'reset-password',   component: ResetPasswordComponent,  canActivate: [guestGuard] },
];
