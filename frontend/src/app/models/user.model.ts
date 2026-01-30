// User Models for Authentication

export interface User {
  id: string;
  displayName: string;
  email?: string;
  avatarUrl?: string;
  loginMethod: 'email' | 'google' | 'apple' | 'facebook';
}

export interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}
