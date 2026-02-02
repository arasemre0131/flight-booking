// Airline Dashboard Container - 011-airline-dashboard

import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { AirlineService } from '../../services/airline.service';
import { AirlineSidebar } from '../../components/airline/sidebar/sidebar';

@Component({
  selector: 'app-airline-dashboard',
  standalone: true,
  imports: [CommonModule, RouterOutlet, AirlineSidebar],
  templateUrl: './airline.html',
  styleUrl: './airline.scss'
})
export class AirlineDashboard implements OnInit {
  private authService = inject(AuthService);
  private airlineService = inject(AirlineService);

  get airlineName(): string {
    return this.authService.getUserDisplayName() || 'Airline';
  }

  async ngOnInit(): Promise<void> {
    await this.airlineService.loadAllData();
  }

  logout(): void {
    this.authService.logout();
  }
}
