// Airline Overview Page - 011-airline-dashboard

import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AirlineService } from '../../../services/airline.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './overview.html',
  styleUrl: './overview.scss'
})
export class Overview {
  private airlineService = inject(AirlineService);
  private authService = inject(AuthService);

  userName = computed(() => this.authService.getUserDisplayName());

  routeCount = computed(() => this.airlineService.routes().length);
  activeRouteCount = computed(() => this.airlineService.activeRoutes().length);

  aircraftCount = computed(() => this.airlineService.aircraft().length);
  activeAircraftCount = computed(() => this.airlineService.activeAircraft().length);

  flightCount = computed(() => this.airlineService.flights().length);
  scheduledFlightCount = computed(() => this.airlineService.scheduledFlights().length);

  quickLinks = [
    { label: 'Manage Routes', path: '/airline/routes', icon: '🛫', description: 'Create and edit flight routes' },
    { label: 'Manage Aircraft', path: '/airline/aircraft', icon: '✈️', description: 'Register and configure aircraft' },
    { label: 'Schedule Flights', path: '/airline/flights', icon: '📅', description: 'Create and manage flight schedules' },
    { label: 'Set Pricing', path: '/airline/pricing', icon: '💰', description: 'Update ticket prices' },
    { label: 'View Statistics', path: '/airline/statistics', icon: '📈', description: 'Analyze performance metrics' }
  ];
}
