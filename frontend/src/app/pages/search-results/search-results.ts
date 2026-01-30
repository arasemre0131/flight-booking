import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { FlightCard } from '../../components/flight-card/flight-card';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { Flight } from '../../models/flight.model';
import { FilterState, DEFAULT_FILTER_STATE } from '../../models/filter.model';
import { MOCK_FLIGHTS } from '../../mock-data/flights.data';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [SearchFormComponent, FlightCard, FilterBar],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss'
})
export class SearchResults implements OnInit {
  private route = inject(ActivatedRoute);

  // All flights from mock data
  private allFlights = signal<Flight[]>(MOCK_FLIGHTS);

  // Filter state
  filters = signal<FilterState>(DEFAULT_FILTER_STATE);

  // UI state
  showAllFlights = signal(false);
  selectedFlightId = signal<string | null>(null);

  // Filtered flights based on current filters
  filteredFlights = computed(() => {
    const flights = this.allFlights();
    const filterState = this.filters();

    return flights.filter(flight => {
      // Max price filter
      if (filterState.maxPrice !== null && flight.price > filterState.maxPrice) {
        return false;
      }

      // Stops filter (X or fewer)
      if (filterState.stops !== null && flight.stops > filterState.stops) {
        return false;
      }

      // Airlines filter (if any selected)
      if (filterState.airlines.length > 0 && !filterState.airlines.includes(flight.airline.code)) {
        return false;
      }

      return true;
    });
  });

  // Flights to display (limited to 6 unless showAll)
  displayedFlights = computed(() => {
    const flights = this.filteredFlights();
    if (this.showAllFlights()) {
      return flights;
    }
    return flights.slice(0, 6);
  });

  // Check if any filters are active
  hasActiveFilters = computed(() => {
    const f = this.filters();
    return f.maxPrice !== null ||
           f.stops !== null ||
           f.airlines.length > 0 ||
           f.seatClass !== null ||
           f.departureTimeRange !== null ||
           f.arrivalTimeRange !== null;
  });

  ngOnInit(): void {
    // Read URL params for search criteria (pre-fill handled by search form)
    this.route.queryParams.subscribe(params => {
      // Future: could filter flights based on origin/destination
      console.log('Search params:', params);
    });
  }

  onFilterChange(newFilters: FilterState): void {
    this.filters.set(newFilters);
    // Reset show all when filters change
    this.showAllFlights.set(false);
  }

  onFlightSelect(flightId: string): void {
    this.selectedFlightId.set(flightId);
  }

  toggleShowAll(): void {
    this.showAllFlights.set(!this.showAllFlights());
  }

  clearFilters(): void {
    this.filters.set(DEFAULT_FILTER_STATE);
  }
}
