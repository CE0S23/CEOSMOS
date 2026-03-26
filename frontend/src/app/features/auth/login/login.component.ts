import {
  Component, OnInit, OnDestroy, inject, signal, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { AuthService } from '../../../core/services/auth.service';
import { startAuthentication } from '@simplewebauthn/browser';

declare const google: {
  accounts: {
    id: {
      initialize(cfg: object): void;
      renderButton(el: HTMLElement, cfg: object): void;
    };
  };
};

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    ButtonModule, 
    ProgressSpinnerModule, 
    TabsModule, 
    InputTextModule, 
    PasswordModule, 
    ReactiveFormsModule, 
    RouterModule
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly fb = inject(FormBuilder);

  readonly isLoading = this.auth.isLoading;
  passkeyAvailable = signal(false);
  errorMessage = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  private scriptEl: HTMLScriptElement | null = null;

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;
    this.auth.checkPlatformAuthenticator().then(ok => this.passkeyAvailable.set(ok));
    this.loadGoogleScript();
  }

  ngOnDestroy(): void {
    this.scriptEl?.remove();
  }

  private loadGoogleScript(): void {
    const CLIENT_ID = ''; // Inserta tu Google OAuth client ID de Google Cloud Console
    if (!CLIENT_ID) { this.initGoogleButton(); return; }
    this.scriptEl = document.createElement('script');
    this.scriptEl.src = 'https://accounts.google.com/gsi/client';
    this.scriptEl.async = true;
    this.scriptEl.defer = true;
    this.scriptEl.onload = () => this.initGoogleButton(CLIENT_ID);
    document.head.appendChild(this.scriptEl);
  }

  private initGoogleButton(clientId?: string): void {
    if (typeof google === 'undefined' || !clientId) return;
    google.accounts.id.initialize({
      client_id: clientId,
      callback: (response: { credential: string }) => {
        this.auth.setLoading(true);
        this.auth.handleGoogleCredential(response.credential);
        this.router.navigate(['/feed']);
      },
      ux_mode: 'popup',
    });
    const btn = document.getElementById('google-btn');
    if (btn) {
      google.accounts.id.renderButton(btn, { theme: 'outline', size: 'large', width: 320 });
    }
  }

  async loginWithPassword() {
    if (this.loginForm.invalid) return;

    this.errorMessage.set(null);
    this.auth.setLoading(true);
    try {
      await this.auth.login(this.loginForm.value);
      this.router.navigate(['/feed']);
    } catch (err: any) {
      if (err.status === 401 && err.error?.message === 'Email not verified') {
        this.router.navigate(['/verify-email']);
      } else {
        this.errorMessage.set('Credenciales inválidas o cuenta no verificada.');
      }
    } finally {
      this.auth.setLoading(false);
    }
  }

  async signInWithPasskey(): Promise<void> {
    this.errorMessage.set(null);
    this.auth.setLoading(true);

    try {
      const emailForm = this.loginForm.get('email')?.value;
      if (!emailForm) {
        throw new Error('Ingresa tu correo en el tab de contraseña antes de usar huella digital');
      }

      // 1. Get options from backend
      const options = await this.auth.webAuthnLoginOptions(emailForm);

      // 2. Start browser check
      const authResp = await startAuthentication(options);

      // 3. Verify in backend
      await this.auth.webAuthnLoginVerify({ email: emailForm, challenge: options.challenge, response: authResp });
      
      this.router.navigate(['/feed']);
    } catch (err: any) {
      const message = err?.response?.data?.message || err.message || 'Error de autenticación';
      this.errorMessage.set(message);
      console.error('Passkey error:', message);
    } finally {
      this.auth.setLoading(false);
    }
  }
}
