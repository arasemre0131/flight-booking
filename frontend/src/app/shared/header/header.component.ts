import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HEADER_NAV_LINKS, NavigationLink } from '../../models/navigation.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  private authService = inject(AuthService);

  readonly navLinks: NavigationLink[] = HEADER_NAV_LINKS;
  readonly isLoggedIn$ = this.authService.isLoggedIn$;
  readonly currentUser$ = this.authService.currentUser$;

  // Mobile menu state
  mobileMenuOpen = signal(false);

  toggleMobileMenu(): void {
    this.mobileMenuOpen.update(open => !open);
  }

  closeMobileMenu(): void {
    this.mobileMenuOpen.set(false);
  }

  // Mock: Open auth modal (will be implemented in SPEC-004A)
  openSignIn(): void {
    console.log('Open Sign In Modal');
    // For testing, login with mock user
    // this.authService.loginWithEmail('test@example.com', 'password');
  }

  openSignUp(): void {
    console.log('Open Sign Up Modal');
  }

  logout(): void {
    this.authService.logout();
  }
}
