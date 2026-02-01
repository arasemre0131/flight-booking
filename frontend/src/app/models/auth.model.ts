// Auth Models for User Authentication

export type UserRole = 'passenger' | 'airline' | 'admin';
export type UserStatus = 'active' | 'inactive';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: UserStatus;
  airlineId?: string;
  mustChangePassword?: boolean;
}

export interface Session {
  token: string;
  user: User;
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
  mustChangePassword?: boolean;
}

// Backend API response types
export interface AuthApiResponse {
  token: string;
  user: User;
}

export interface ApiError {
  error: string;
}
