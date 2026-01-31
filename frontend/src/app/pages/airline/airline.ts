// Airline Dashboard Container - 011-airline-dashboard

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AirlineSidebar } from '../../components/airline/sidebar/sidebar';

@Component({
  selector: 'app-airline-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AirlineSidebar],
  templateUrl: './airline.html',
  styleUrl: './airline.scss'
})
export class AirlineDashboard {
  private authService = inject(AuthService);

  get airlineName(): string {
    return this.authService.getUserDisplayName() || 'Airline';
  }

  logout(): void {
    this.authService.logout();
  }
}
