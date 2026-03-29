import {
  Component, OnInit, OnDestroy, inject, signal, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
  passkeyEmailError = signal<string | null>(null);

  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]]
  });

  passkeyEmailControl = new FormControl('', [Validators.required, Validators.email]);

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
        localStorage.setItem('verify_email', this.loginForm.value.email);
        this.router.navigate(['/verify-email']);
      } else {
        this.errorMessage.set('Credenciales inválidas o cuenta no verificada.');
      }
    } finally {
      this.auth.setLoading(false);
    }
  }

  async signInWithPasskey(): Promise<void> {
    this.passkeyEmailError.set(null);
    this.errorMessage.set(null);

    const email = this.passkeyEmailControl.value?.trim();
    if (!email || this.passkeyEmailControl.invalid) {
      this.passkeyEmailError.set('Ingresa un correo electrónico válido.');
      return;
    }

    this.auth.setLoading(true);
    try {
      const options = await this.auth.webAuthnLoginOptions(email);
      const authResp = await startAuthentication({ optionsJSON: options });
      await this.auth.webAuthnLoginVerify({ email, challenge: options.challenge, response: authResp });
      this.router.navigate(['/feed']);
    } catch (err: any) {
      if (err?.name === 'NotAllowedError') {
        this.errorMessage.set('Autenticación cancelada.');
      } else if (err?.name === 'NotSupportedError') {
        this.errorMessage.set('Tu dispositivo no soporta huella digital.');
      } else {
        const msg = err?.error?.message ?? err?.message ?? 'Error de autenticación.';
        this.errorMessage.set(msg);
      }
    } finally {
      this.auth.setLoading(false);
    }
  }
}
