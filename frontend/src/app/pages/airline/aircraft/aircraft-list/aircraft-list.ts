// Aircraft List Page - 011-airline-dashboard

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AirlineService } from '../../../../services/airline.service';
import { Aircraft } from '../../../../models/aircraft.model';
import { ConfirmationDialog } from '../../../../components/airline/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-aircraft-list',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ConfirmationDialog],
  templateUrl: './aircraft-list.html',
  styleUrl: './aircraft-list.scss'
})
export class AircraftList {
  private airlineService = inject(AirlineService);

  searchTerm = signal('');
  showConfirmDialog = signal(false);
  aircraftToToggle = signal<Aircraft | null>(null);

  aircraft = this.airlineService.aircraft;

  filteredAircraft = computed(() => {
    const term = this.searchTerm().toLowerCase();
    if (!term) return this.aircraft();

    return this.aircraft().filter(a =>
      a.registration.toLowerCase().includes(term) ||
      a.model.toLowerCase().includes(term)
    );
  });

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchTerm.set(target.value);
  }

  getSeatBreakdown(aircraft: Aircraft): string {
    const parts = [`${aircraft.economyConfig.totalSeats} economy`];
    if (aircraft.businessConfig) {
      parts.push(`${aircraft.businessConfig.totalSeats} business`);
    }
    if (aircraft.firstClassConfig) {
      parts.push(`${aircraft.firstClassConfig.totalSeats} first`);
    }
    return parts.join(', ');
  }

  confirmToggleStatus(aircraft: Aircraft): void {
    // Check for scheduled flights
    if (aircraft.isActive && this.airlineService.hasScheduledFlights(aircraft.id)) {
      alert('Cannot deactivate aircraft with scheduled flights');
      return;
    }
    this.aircraftToToggle.set(aircraft);
    this.showConfirmDialog.set(true);
  }

  async toggleStatus(): Promise<void> {
    const aircraft = this.aircraftToToggle();
    if (aircraft) {
      await this.airlineService.toggleAircraftStatus(aircraft.id);
    }
    this.showConfirmDialog.set(false);
    this.aircraftToToggle.set(null);
  }

  cancelToggle(): void {
    this.showConfirmDialog.set(false);
    this.aircraftToToggle.set(null);
  }

  getConfirmMessage(): string {
    const aircraft = this.aircraftToToggle();
    if (!aircraft) return '';

    const action = aircraft.isActive ? 'deactivate' : 'activate';
    return `Are you sure you want to ${action} aircraft ${aircraft.registration} (${aircraft.model})?`;
  }
}
