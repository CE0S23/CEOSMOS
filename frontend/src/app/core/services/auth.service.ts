import { Injectable, signal, computed } from '@angular/core';
import { UserProfile, AuthState } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly _state = signal<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: false,
  });

  readonly state = this._state.asReadonly();
  readonly user = computed(() => this._state().user);
  readonly isAuthenticated = computed(() => this._state().isAuthenticated);
  readonly isLoading = computed(() => this._state().isLoading);

  setLoading(loading: boolean): void {
    this._state.update(s => ({ ...s, isLoading: loading }));
  }

  setUser(user: UserProfile): void {
    this._state.set({ user, isAuthenticated: true, isLoading: false });
  }

  signOut(): void {
    this._state.set({ user: null, isAuthenticated: false, isLoading: false });
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
      this.setLoading(false);
    }
  }
}
