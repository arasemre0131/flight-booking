import { Injectable, signal, computed } from '@angular/core';
import { User, Session, AuthResult, RegisterData } from '../models/auth.model';
import { MOCK_USERS } from '../mock-data/users.data';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly USERS_KEY = 'tripma_users';
  private readonly SESSION_KEY = 'tripma_session';

  // Private signals for state
  private _isAuthenticated = signal(false);
  private _currentUser = signal<User | null>(null);
  private _isLoading = signal(false);

  // Public readonly signals
  readonly isAuthenticated = this._isAuthenticated.asReadonly();
  readonly currentUser = this._currentUser.asReadonly();
  readonly isLoading = this._isLoading.asReadonly();

  // Computed signals for backwards compatibility
  readonly isLoggedIn$ = computed(() => this._isAuthenticated());
  readonly currentUser$ = computed(() => this._currentUser());

  constructor() {
    this.initializeUsers();
    this.checkSession();
  }

  /**
   * Initialize users in localStorage if not exists
   */
  private initializeUsers(): void {
    const existingUsers = localStorage.getItem(this.USERS_KEY);
    if (!existingUsers) {
      localStorage.setItem(this.USERS_KEY, JSON.stringify(MOCK_USERS));
    }
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

        // Check if session is expired
        if (new Date(session.expiresAt) > new Date()) {
          const users = this.getUsers();
          const user = users.find(u => u.id === session.userId);
          if (user) {
            this._isAuthenticated.set(true);
            this._currentUser.set(user);
          } else {
            this.clearSession();
          }
        } else {
          // Session expired, clear it
          this.clearSession();
        }
      } catch {
        this.clearSession();
      }
    }
  }

  /**
   * Login with email and password
   */
  async login(email: string, password: string, rememberMe: boolean): Promise<AuthResult> {
    this._isLoading.set(true);

    // Simulate network delay
    await this.delay(500);

    try {
      const users = this.getUsers();
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

      if (!user) {
        this._isLoading.set(false);
        return { success: false, error: 'Invalid email or password' };
      }

      if (user.password !== password) {
        this._isLoading.set(false);
        return { success: false, error: 'Invalid email or password' };
      }

      // Create session
      const session = this.createSession(user.id, rememberMe);
      this.saveSession(session);

      // Update state
      this._isAuthenticated.set(true);
      this._currentUser.set(user);
      this._isLoading.set(false);

      return { success: true, user };
    } catch (error) {
      this._isLoading.set(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResult> {
    this._isLoading.set(true);

    // Simulate network delay
    await this.delay(500);

    try {
      const users = this.getUsers();

      // Check if email already exists
      const existingUser = users.find(u => u.email.toLowerCase() === data.email.toLowerCase());
      if (existingUser) {
        this._isLoading.set(false);
        return { success: false, error: 'Email already registered' };
      }

      // Create new user
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: data.email.toLowerCase(),
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        createdAt: new Date().toISOString()
      };

      // Save user
      users.push(newUser);
      this.saveUsers(users);

      // Auto-login after registration (with remember me = true)
      const session = this.createSession(newUser.id, true);
      this.saveSession(session);

      // Update state
      this._isAuthenticated.set(true);
      this._currentUser.set(newUser);
      this._isLoading.set(false);

      return { success: true, user: newUser };
    } catch (error) {
      this._isLoading.set(false);
      return { success: false, error: 'An unexpected error occurred' };
    }
  }

  /**
   * Logout the current user
   */
  logout(): void {
    this.clearSession();
    this._isAuthenticated.set(false);
    this._currentUser.set(null);
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
    // Mock social login
    const mockUser: User = {
      id: `user-google-${Date.now()}`,
      email: 'google.user@gmail.com',
      password: '',
      firstName: 'Google',
      lastName: 'User',
      createdAt: new Date().toISOString()
    };
    this._isAuthenticated.set(true);
    this._currentUser.set(mockUser);
  }

  loginWithApple(): void {
    const mockUser: User = {
      id: `user-apple-${Date.now()}`,
      email: 'apple.user@icloud.com',
      password: '',
      firstName: 'Apple',
      lastName: 'User',
      createdAt: new Date().toISOString()
    };
    this._isAuthenticated.set(true);
    this._currentUser.set(mockUser);
  }

  loginWithFacebook(): void {
    const mockUser: User = {
      id: `user-fb-${Date.now()}`,
      email: 'fb.user@facebook.com',
      password: '',
      firstName: 'Facebook',
      lastName: 'User',
      createdAt: new Date().toISOString()
    };
    this._isAuthenticated.set(true);
    this._currentUser.set(mockUser);
  }

  // Private helpers
  private getUsers(): User[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  private saveUsers(users: User[]): void {
    localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
  }

  private createSession(userId: string, rememberMe: boolean): Session {
    const expiryDays = rememberMe ? 30 : 1;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + expiryDays);

    return {
      userId,
      token: crypto.randomUUID(),
      expiresAt: expiresAt.toISOString(),
      rememberMe
    };
  }

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

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
