import { Component, input, output, signal } from '@angular/core';
import { FilterState, TimeRange, SeatClass, TIME_RANGES, STOPS_OPTIONS } from '../../models/filter.model';
import { AIRLINES } from '../../mock-data/airlines.data';
import { Airline } from '../../models/flight.model';

type DropdownType = 'price' | 'stops' | 'times' | 'airlines' | 'class' | 'more' | null;

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [],
  templateUrl: './filter-bar.html',
  styleUrl: './filter-bar.scss',
  host: {
    '(document:click)': 'onDocumentClick($event)'
  }
})
export class FilterBar {
  // Inputs
  filters = input.required<FilterState>();

  // Outputs
  filterChange = output<FilterState>();

  // State
  activeDropdown = signal<DropdownType>(null);

  // Constants for template
  stopsOptions = STOPS_OPTIONS;
  timeRanges = TIME_RANGES;
  airlines: Airline[] = AIRLINES;

  toggleDropdown(dropdown: DropdownType): void {
    if (this.activeDropdown() === dropdown) {
      this.activeDropdown.set(null);
    } else {
      this.activeDropdown.set(dropdown);
    }
  }

  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.filter-dropdown')) {
      this.activeDropdown.set(null);
    }
  }

  setMaxPrice(price: number | null): void {
    this.emitFilterChange({ maxPrice: price });
    this.activeDropdown.set(null);
  }

  setStops(stops: number | null): void {
    this.emitFilterChange({ stops });
    this.activeDropdown.set(null);
  }

  setTimeRange(range: TimeRange | null): void {
    this.emitFilterChange({ departureTimeRange: range });
    this.activeDropdown.set(null);
  }

  setSeatClass(seatClass: SeatClass | null): void {
    this.emitFilterChange({ seatClass });
    this.activeDropdown.set(null);
  }

  toggleAirline(code: string): void {
    const currentAirlines = [...this.filters().airlines];
    const index = currentAirlines.indexOf(code);

    if (index > -1) {
      currentAirlines.splice(index, 1);
    } else {
      currentAirlines.push(code);
    }

    this.emitFilterChange({ airlines: currentAirlines });
  }

  clearAirlines(): void {
    this.emitFilterChange({ airlines: [] });
    this.activeDropdown.set(null);
  }

  private emitFilterChange(partial: Partial<FilterState>): void {
    this.filterChange.emit({
      ...this.filters(),
      ...partial
    });
  }
}
