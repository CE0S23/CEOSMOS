import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { UserProfile, AuthState } from '../models/user.model';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _state = signal<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;
  private readonly messageService = inject(MessageService);

  readonly state = this._state.asReadonly();
  readonly user = computed(() => this._state().user);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly isLoading = computed(() => this._state().isLoading);

  setLoading(loading: boolean): void {
    this._state.update(s => ({ ...s, isLoading: loading }));
  }

  setUser(user: UserProfile | null): void {
    if (user) {
      this._state.set({ user, isAuthenticated: true, isLoading: false });
    } else {
      this._state.set({ user: null, isAuthenticated: false, isLoading: false });
    }
  }

  setAuthenticated(isAuth: boolean) {
    this._state.update(s => ({ ...s, isAuthenticated: isAuth }));
    if (!isAuth) {
      this.setUser(null);
    }
  }

  async signOut(): Promise<void> {
    try {
      await firstValueFrom(this.http.post(`${this.apiUrl}/auth/logout`, {}));
    } finally {
      this.setUser(null);
    }
  }

  // --- API Authentication Methods ---
  
  async getMe(): Promise<UserProfile> {
    const user = await firstValueFrom(this.http.get<UserProfile>(`${this.apiUrl}/users/me`));
    this.setUser(user);
    return user;
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/auth/change-password`, { currentPassword, newPassword }));
  }

  async register(data: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/auth/register`, data));
  }

  async verifyEmail(email: string, code: string): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/auth/verify-email`, { email, code }));
  }

  async resendVerification(email: string): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/auth/resend-verification`, { email }));
  }

  async login(data: any): Promise<any> {
    const response = await firstValueFrom(this.http.post(`${this.apiUrl}/auth/login`, data));
    // Following successful login, get the user profile to populate state
    await this.getMe();
    return response;
  }

  async webAuthnRegisterOptions(): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/auth/webauthn/register/options`, {}));
  }

  async webAuthnRegisterVerify(data: any): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/auth/webauthn/register/verify`, data));
  }

  async webAuthnLoginOptions(email?: string): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/auth/webauthn/login/options`, email ? { email } : {}));
  }

  async webAuthnLoginVerify(data: any): Promise<any> {
    const response = await firstValueFrom(this.http.post(`${this.apiUrl}/auth/webauthn/login/verify`, data));
    await this.getMe();
    return response;
  }

  async forgotPassword(email: string): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/auth/forgot-password`, { email }));
  }

  async resetPassword(token: string, newPassword: string): Promise<any> {
    return firstValueFrom(this.http.post(`${this.apiUrl}/auth/reset-password`, { token, newPassword }));
  }

  isPasskeySupported(): boolean {
    return (
      window.PublicKeyCredential !== undefined &&
      typeof window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function'
    );
  }

  async checkPlatformAuthenticator(): Promise<boolean> {
    if (!this.isPasskeySupported()) return false;
    return window.PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
  }

  handleGoogleCredential(credentialJwt: string): void {
    try {
      const parts = credentialJwt.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT format');
      const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
      const user: UserProfile = {
        id: payload['sub'] ?? '',
        name: payload['name'] ?? '',
        email: payload['email'] ?? '',
        picture: payload['picture'],
        provider: 'google',
      };
      this.setUser(user);
    } catch {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fallo al autenticar con Google' });
      this.setLoading(false);
    }
  }
}
