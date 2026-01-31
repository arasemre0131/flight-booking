// Auth Models for User Authentication

export type UserRole = 'passenger' | 'airline' | 'admin';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  createdAt: string;
  airlineId?: string;
}

export interface Session {
  userId: string;
  token: string;
  expiresAt: string;
  rememberMe: boolean;
}

export interface AuthState {
  isAuthenticated: boolean;
  currentUser: User | null;
  isLoading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface AuthResult {
  success: boolean;
  error?: string;
  user?: User;
}
