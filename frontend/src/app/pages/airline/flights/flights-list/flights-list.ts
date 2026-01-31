// Flights List Page - 011-airline-dashboard

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { AirlineService } from '../../../../services/airline.service';
import { AirlineFlight, FlightStatus } from '../../../../models/airline-stats.model';
import { FlightsCalendar } from '../flights-calendar/flights-calendar';
import { ConfirmationDialog } from '../../../../components/airline/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-flights-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, FlightsCalendar, ConfirmationDialog],
  templateUrl: './flights-list.html',
  styleUrl: './flights-list.scss'
})
export class FlightsList {
  private airlineService = inject(AirlineService);

  allFlights = this.airlineService.flights;
  routes = this.airlineService.routes;
  aircraft = this.airlineService.aircraft;

  // View toggle
  viewMode = signal<'list' | 'calendar'>('list');

  // Filters
  selectedDate = signal<Date | null>(null);
  selectedRoute = signal<string>('');
  selectedStatus = signal<string>('');

  // Cancel modal
  showCancelModal = signal(false);
  flightToCancel = signal<AirlineFlight | null>(null);

  // Filtered flights
  flights = computed(() => {
    let filtered = this.allFlights();

    // Filter by date
    if (this.selectedDate()) {
      const date = this.selectedDate()!;
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      filtered = filtered.filter(f => {
        const flightDate = new Date(f.departureTime);
        return flightDate >= startOfDay && flightDate <= endOfDay;
      });
    }

    // Filter by route
    if (this.selectedRoute()) {
      filtered = filtered.filter(f => f.routeId === this.selectedRoute());
    }

    // Filter by status
    if (this.selectedStatus()) {
      filtered = filtered.filter(f => f.status === this.selectedStatus());
    }

    // Sort by departure time
    return [...filtered].sort((a, b) =>
      new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
    );
  });

  statuses: FlightStatus[] = ['scheduled', 'boarding', 'departed', 'arrived', 'cancelled'];

  onDateSelected(date: Date): void {
    this.selectedDate.set(date);
  }

  clearDateFilter(): void {
    this.selectedDate.set(null);
  }

  getRouteName(routeId: string): string {
    const route = this.routes().find(r => r.id === routeId);
    return route ? `${route.originAirport} → ${route.destinationAirport}` : 'Unknown';
  }

  getAircraftName(aircraftId: string): string {
    const aircraft = this.aircraft().find(a => a.id === aircraftId);
    return aircraft ? `${aircraft.registration} (${aircraft.model})` : 'Unknown';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  formatDuration(minutes: number): string {
    const h = Math.floor(minutes / 60);
    const m = minutes % 60;
    return `${h}h ${m}m`;
  }

  getStatusClass(status: string): string {
    const classes: Record<string, string> = {
      scheduled: 'status-scheduled',
      boarding: 'status-boarding',
      departed: 'status-departed',
      arrived: 'status-arrived',
      cancelled: 'status-cancelled'
    };
    return classes[status] || '';
  }

  getTotalSeats(aircraftId: string): number {
    const aircraft = this.aircraft().find(a => a.id === aircraftId);
    return aircraft?.totalSeats || 0;
  }

  async changeStatus(flight: AirlineFlight, newStatus: FlightStatus): Promise<void> {
    await this.airlineService.updateFlightStatus(flight.id, newStatus);
  }

  openCancelModal(flight: AirlineFlight): void {
    this.flightToCancel.set(flight);
    this.showCancelModal.set(true);
  }

  closeCancelModal(): void {
    this.showCancelModal.set(false);
    this.flightToCancel.set(null);
  }

  async confirmCancel(): Promise<void> {
    if (this.flightToCancel()) {
      await this.airlineService.cancelFlight(this.flightToCancel()!.id);
    }
    this.closeCancelModal();
  }

  canChangeStatus(flight: AirlineFlight): boolean {
    return flight.status === 'scheduled' || flight.status === 'boarding';
  }

  getNextStatuses(currentStatus: FlightStatus): FlightStatus[] {
    const transitions: Record<FlightStatus, FlightStatus[]> = {
      scheduled: ['boarding'],
      boarding: ['departed'],
      departed: ['arrived'],
      arrived: [],
      cancelled: []
    };
    return transitions[currentStatus] || [];
  }
}
