// Routes List Page - 011-airline-dashboard

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AirlineService } from '../../../../services/airline.service';
import { AirlineRoute } from '../../../../models/airline-route.model';
import { ConfirmationDialog } from '../../../../components/airline/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-routes-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ConfirmationDialog],
  templateUrl: './routes-list.html',
  styleUrl: './routes-list.scss'
})
export class RoutesList {
  private airlineService = inject(AirlineService);

  searchTerm = signal('');
  showConfirmDialog = signal(false);
  routeToToggle = signal<AirlineRoute | null>(null);

  routes = this.airlineService.routes;

  filteredRoutes = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.routes();

    return this.routes().filter(route =>
      route.flightNumberPrefix.toLowerCase().includes(term) ||
      route.originAirport.toLowerCase().includes(term) ||
      route.destinationAirport.toLowerCase().includes(term)
    );
  });

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  confirmToggleStatus(route: AirlineRoute): void {
    this.routeToToggle.set(route);
    this.showConfirmDialog.set(true);
  }

  async toggleStatus(): Promise<void> {
    const route = this.routeToToggle();
    if (route) {
      await this.airlineService.toggleRouteStatus(route.id);
    }
    this.showConfirmDialog.set(false);
    this.routeToToggle.set(null);
  }

  cancelToggle(): void {
    this.showConfirmDialog.set(false);
    this.routeToToggle.set(null);
  }

  getConfirmMessage(): string {
    const route = this.routeToToggle();
    if (!route) return '';

    const action = route.isActive ? 'deactivate' : 'activate';
    return `Are you sure you want to ${action} route ${route.flightNumberPrefix} (${route.originAirport} → ${route.destinationAirport})?`;
  }
}
