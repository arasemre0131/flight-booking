import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { User, AuthState } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState = new BehaviorSubject<AuthState>({
    isLoggedIn: false,
    user: null
  });

  // Observable streams
  readonly authState$ = this.authState.asObservable();
  readonly isLoggedIn$ = this.authState$.pipe(map(state => state.isLoggedIn));
  readonly currentUser$ = this.authState$.pipe(map(state => state.user));

  // Login with email/phone
  loginWithEmail(email: string, password: string): void {
    const displayName = email.split('@')[0] || email;
    this.setUser({
      id: Date.now().toString(),
      displayName,
      email,
      loginMethod: 'email'
    });
  }

  // Social logins - instant, name = "User"
  loginWithGoogle(): void {
    this.setUser({
      id: Date.now().toString(),
      displayName: 'User',
      loginMethod: 'google'
    });
  }

  loginWithApple(): void {
    this.setUser({
      id: Date.now().toString(),
      displayName: 'User',
      loginMethod: 'apple'
    });
  }

  loginWithFacebook(): void {
    this.setUser({
      id: Date.now().toString(),
      displayName: 'User',
      loginMethod: 'facebook'
    });
  }

  // Logout
  logout(): void {
    this.authState.next({ isLoggedIn: false, user: null });
  }

  // Check if logged in (sync)
  isLoggedIn(): boolean {
    return this.authState.getValue().isLoggedIn;
  }

  // Get current user (sync)
  getCurrentUser(): User | null {
    return this.authState.getValue().user;
  }

  private setUser(user: User): void {
    this.authState.next({ isLoggedIn: true, user });
  }
}
