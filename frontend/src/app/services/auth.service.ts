import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { User, Session, AuthResult, RegisterData, AuthApiResponse } from '../models/auth.model';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;
  private readonly SESSION_KEY = 'skyroute_session';

  // Private signals for state
  private _isAuthenticated = signal(false);
  private _currentUser = signal<User | null>(null);
  private _isLoading = signal(false);
  private _token = signal<string | null>(null);

  // Public readonly signals
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();
  readonly token = this._token.asReadonly();

  // Computed signals for backwards compatibility
  readonly isLoggedIn$ = computed(() => this._isAuthenticated());
  readonly currentUser$ = computed(() => this._currentUser());

  constructor() {
    this.checkSession();
  }

  /**
   * Check for existing session on app load
   */
  private checkSession(): void {
    // Check localStorage first (remember me = true)
    let sessionData = localStorage.getItem(this.SESSION_KEY);

    // If not in localStorage, check sessionStorage (remember me = false)
    if (!sessionData) {
      sessionData = sessionStorage.getItem(this.SESSION_KEY);
    }

    if (sessionData) {
      try {
        const session: Session = JSON.parse(sessionData);
        this._isAuthenticated.set(true);
        this._currentUser.set(session.user);
        this._token.set(session.token);
      } catch {
        this.clearSession();
      }
    }
  }

  /**
   * Get auth token for API requests
   */
  getToken(): string | null {
    return this._token();
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string, rememberMe: boolean): Promise<AuthResult> {
    this._isLoading.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post<AuthApiResponse>(`${this.API_URL}/auth/login`, { email, password })
      );

      // Create session
      const session: Session = {
        token: response.token,
        user: response.user,
        rememberMe
      };
      this.saveSession(session);

      // Update state
      this._isAuthenticated.set(true);
      this._currentUser.set(response.user);
      this._token.set(response.token);
      this._isLoading.set(false);

      return {
        success: true,
        user: response.user,
        mustChangePassword: response.user.mustChangePassword
      };
    } catch (error) {
      this._isLoading.set(false);
      const message = this.getErrorMessage(error);
      return { success: false, error: message };
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResult> {
    this._isLoading.set(true);

    try {
      const response = await firstValueFrom(
        this.http.post<AuthApiResponse>(`${this.API_URL}/auth/register`, data)
      );

      // Create session (auto-login after registration)
      const session: Session = {
        token: response.token,
        user: response.user,
        rememberMe: true
      };
      this.saveSession(session);

      // Update state
      this._isAuthenticated.set(true);
      this._currentUser.set(response.user);
      this._token.set(response.token);
      this._isLoading.set(false);

      return { success: true, user: response.user };
    } catch (error) {
      this._isLoading.set(false);
      const message = this.getErrorMessage(error);
      return { success: false, error: message };
    }
  }

  /**
   * Change password
   */
  async changePassword(currentPassword: string, newPassword: string): Promise<AuthResult> {
    this._isLoading.set(true);

    try {
      await firstValueFrom(
        this.http.put(`${this.API_URL}/auth/change-password`, {
          currentPassword,
          newPassword
        }, {
          headers: { Authorization: `Bearer ${this._token()}` }
        })
      );

      // Update user state to clear mustChangePassword
      const user = this._currentUser();
      if (user) {
        const updatedUser = { ...user, mustChangePassword: false };
        this._currentUser.set(updatedUser);

        // Update session
        const sessionData = localStorage.getItem(this.SESSION_KEY) || sessionStorage.getItem(this.SESSION_KEY);
        if (sessionData) {
          const session: Session = JSON.parse(sessionData);
          session.user = updatedUser;
          this.saveSession(session);
        }
      }

      this._isLoading.set(false);
      return { success: true };
    } catch (error) {
      this._isLoading.set(false);
      const message = this.getErrorMessage(error);
      return { success: false, error: message };
    }
  }

  /**
   * Logout the current user
   */
  async logout(): Promise<void> {
    try {
      if (this._token()) {
        await firstValueFrom(
          this.http.post(`${this.API_URL}/auth/logout`, {}, {
            headers: { Authorization: `Bearer ${this._token()}` }
          })
        );
      }
    } catch {
      // Ignore errors, clear local session anyway
    }

    this.clearSession();
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
    this._token.set(null);
  }

  /**
   * Get user's display name
   */
  getUserDisplayName(): string {
    const user = this._currentUser();
    return user ? `${user.firstName} ${user.lastName}` : '';
  }

  /**
   * Get user's initials
   */
  getUserInitials(): string {
    const user = this._currentUser();
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  // Backward compatibility methods
  isLoggedIn(): boolean {
    return this._isAuthenticated();
  }

  getCurrentUser(): User | null {
    return this._currentUser();
  }

  // Legacy methods for backward compatibility with header
  loginWithEmail(email: string, password: string): void {
    this.login(email, password, false);
  }

  loginWithGoogle(): void {
    console.warn('Social login not implemented with backend');
  }

  loginWithApple(): void {
    console.warn('Social login not implemented with backend');
  }

  loginWithFacebook(): void {
    console.warn('Social login not implemented with backend');
  }

  // Private helpers
  private saveSession(session: Session): void {
    const sessionData = JSON.stringify(session);
    if (session.rememberMe) {
      localStorage.setItem(this.SESSION_KEY, sessionData);
      sessionStorage.removeItem(this.SESSION_KEY);
    } else {
      sessionStorage.setItem(this.SESSION_KEY, sessionData);
      localStorage.removeItem(this.SESSION_KEY);
    }
  }

  private clearSession(): void {
    localStorage.removeItem(this.SESSION_KEY);
    sessionStorage.removeItem(this.SESSION_KEY);
  }

  private getErrorMessage(error: unknown): string {
    if (error instanceof HttpErrorResponse) {
      return error.error?.error || error.message || 'An unexpected error occurred';
    }
    return 'An unexpected error occurred';
  }
}
