import {
  Component, OnInit, OnDestroy, inject, signal, PLATFORM_ID
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { AuthService } from '../../../core/services/auth.service';

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
  imports: [ButtonModule, ProgressSpinnerModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);

  readonly isLoading = this.auth.isLoading;
  passkeyAvailable = signal(false);
  errorMessage = signal<string | null>(null);

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

  async signInWithPasskey(): Promise<void> {
    this.errorMessage.set(null);
    this.auth.setLoading(true);
    try {
      const challenge = crypto.getRandomValues(new Uint8Array(32));
      const userId = crypto.getRandomValues(new Uint8Array(16));
      
      const options: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: 'CEOSmos',
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: 'ceosmos_user',
          displayName: 'Usuario Biometrico',
        },
        pubKeyCredParams: [
          { type: 'public-key', alg: -7 },   // ECDSA
          { type: 'public-key', alg: -257 }, // RSA
        ],
        authenticatorSelection: {
          authenticatorAttachment: 'platform', // Fuerza el lector de huella/Windows Hello local
          userVerification: 'required',
          requireResidentKey: true,
        },
        timeout: 60000,
      };

      // Usamos create() en lugar de get() para registrar la biometria local 
      // y obligar a que salte el sensor de huella de la laptop.
      const credential = await navigator.credentials.create({ publicKey: options });
      
      if (credential) {
        this.auth.setUser({
          id: 'passkey-user',
          name: 'Usuario Biometrico',
          email: '',
          provider: 'passkey',
        });
        this.router.navigate(['/feed']);
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Error de autenticacion';
      this.errorMessage.set('No se pudo autenticar con biometria.');
      console.error('Passkey error:', message);
    } finally {
      this.auth.setLoading(false);
    }
  }
}
