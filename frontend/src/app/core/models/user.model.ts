export type AuthProvider = 'google' | 'passkey';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  provider: AuthProvider;
}

export interface GoogleCredentialResponse {
  credential: string;
  select_by?: string;
}

export interface PasskeyCredential {
  id: string;
  rawId: ArrayBuffer;
  response: AuthenticatorAssertionResponse;
  type: 'public-key';
}

export interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
