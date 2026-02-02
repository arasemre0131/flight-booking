// Pricing List Page - 011-airline-dashboard

import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AirlineService } from '../../../../services/airline.service';
import { AirlineFlight, FlightPricing } from '../../../../models/airline-stats.model';

@Component({
  selector: 'app-pricing-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pricing-list.html',
  styleUrl: './pricing-list.scss'
})
export class PricingList {
  private airlineService = inject(AirlineService);

  flights = this.airlineService.flights;
  routes = this.airlineService.routes;

  // Filter
  selectedRoute = signal<string>('');

  // Inline editing
  editingCell = signal<{ flightId: string; field: string } | null>(null);
  editValue = signal<number>(0);

  // Bulk selection
  selectedFlights = signal<Set<string>>(new Set());
  showBulkModal = signal(false);
  bulkPricing = signal<FlightPricing>({ economy: 0, business: null, firstClass: null });

  // Feedback
  savedFlightId = signal<string | null>(null);

  filteredFlights = computed(() => {
    let filtered = this.flights().filter(f => f.status === 'scheduled');

    if (this.selectedRoute()) {
      filtered = filtered.filter(f => f.routeId === this.selectedRoute());
    }

    return [...filtered].sort((a, b) =>
      new Date(a.departureTime).getTime() - new Date(b.departureTime).getTime()
    );
  });

  allSelected = computed(() => {
    const flights = this.filteredFlights();
    return flights.length > 0 && flights.every(f => this.selectedFlights().has(f.id));
  });

  getRouteName(routeId: string): string {
    const route = this.routes().find(r => r.id === routeId);
    return route ? `${route.originAirport} → ${route.destinationAirport}` : 'Unknown';
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }

  formatPrice(cents: number | null): string {
    if (cents === null) return '-';
    return `€${(cents / 100).toFixed(2)}`;
  }

  // Inline editing
  startEdit(flightId: string, field: string, currentValue: number | null): void {
    this.editingCell.set({ flightId, field });
    this.editValue.set(currentValue ? currentValue / 100 : 0);
  }

  isEditing(flightId: string, field: string): boolean {
    const cell = this.editingCell();
    return cell?.flightId === flightId && cell?.field === field;
  }

  async saveEdit(): Promise<void> {
    const cell = this.editingCell();
    if (!cell) return;

    const flight = this.flights().find(f => f.id === cell.flightId);
    if (!flight) return;

    const newValue = Math.round(this.editValue() * 100);
    const pricing: FlightPricing = { ...flight.pricing };

    switch (cell.field) {
      case 'economy':
        pricing.economy = newValue;
        break;
      case 'business':
        pricing.business = newValue || null;
        break;
      case 'firstClass':
        pricing.firstClass = newValue || null;
        break;
    }

    await this.airlineService.updateFlightPricing(cell.flightId, pricing);

    // Show saved feedback
    this.savedFlightId.set(cell.flightId);
    setTimeout(() => this.savedFlightId.set(null), 1500);

    this.cancelEdit();
  }

  cancelEdit(): void {
    this.editingCell.set(null);
    this.editValue.set(0);
  }

  onEditKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      this.saveEdit();
    } else if (event.key === 'Escape') {
      this.cancelEdit();
    }
  }

  // Selection
  toggleSelection(flightId: string): void {
    const current = new Set(this.selectedFlights());
    if (current.has(flightId)) {
      current.delete(flightId);
    } else {
      current.add(flightId);
    }
    this.selectedFlights.set(current);
  }

  toggleAllSelection(): void {
    if (this.allSelected()) {
      this.selectedFlights.set(new Set());
    } else {
      const ids = new Set(this.filteredFlights().map(f => f.id));
      this.selectedFlights.set(ids);
    }
  }

  isSelected(flightId: string): boolean {
    return this.selectedFlights().has(flightId);
  }

  // Bulk editing
  openBulkModal(): void {
    if (this.selectedFlights().size === 0) return;
    this.bulkPricing.set({ economy: 0, business: null, firstClass: null });
    this.showBulkModal.set(true);
  }

  closeBulkModal(): void {
    this.showBulkModal.set(false);
  }

  async applyBulkPricing(): Promise<void> {
    const ids = Array.from(this.selectedFlights());
    const bulk = this.bulkPricing();
    const pricing: FlightPricing = {
      economy: Math.round((bulk.economy || 0) * 100),
      business: bulk.business ? Math.round(bulk.business * 100) : null,
      firstClass: bulk.firstClass ? Math.round(bulk.firstClass * 100) : null
    };

    await this.airlineService.bulkUpdatePricing(ids, pricing);

    this.selectedFlights.set(new Set());
    this.closeBulkModal();
  }

  updateBulkPricing(field: 'economy' | 'business' | 'firstClass', value: number): void {
    const current = this.bulkPricing();
    this.bulkPricing.set({ ...current, [field]: value });
  }
}
