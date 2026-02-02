// Admin Header Component - 012-admin-panel

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-admin-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.scss'
})
export class AdminHeader {
  private authService = inject(AuthService);
  private router = inject(Router);

  get userName(): string {
    return this.authService.getUserDisplayName();
  }

  get userInitials(): string {
    return this.authService.getUserInitials();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
