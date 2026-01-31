import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { FlightCard } from '../../components/flight-card/flight-card';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { SidebarContent } from '../../components/sidebar-content/sidebar-content';
import { Flight } from '../../models/flight.model';
import { FilterState, DEFAULT_FILTER_STATE } from '../../models/filter.model';
import { MOCK_FLIGHTS } from '../../mock-data/flights.data';
import { AirportService } from '../../services/airport.service';
import { BookingService } from '../../services/booking.service';
import { SearchCriteria, DEFAULT_SEARCH_CRITERIA } from '../../models/search-criteria.model';

@Component({
  selector: 'app-search-results',
  standalone: true,
  imports: [SearchFormComponent, FlightCard, FilterBar, SidebarContent],
  templateUrl: './search-results.html',
  styleUrl: './search-results.scss'
})
export class SearchResults implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private airportService = inject(AirportService);
  private bookingService = inject(BookingService);

  // All flights from mock data
  private allFlights = signal<Flight[]>(MOCK_FLIGHTS);

  // Search criteria from URL
  private searchCriteria = signal<SearchCriteria>(DEFAULT_SEARCH_CRITERIA);

  // Filter state
  filters = signal<FilterState>(DEFAULT_FILTER_STATE);

  // UI state
  showAllFlights = signal(false);
  selectedFlightId = signal<string | null>(null);

  // Destination city for sidebar
  destinationCity = signal<string>('your destination');

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

  // Get selected flight object
  selectedFlight = computed(() => {
    const id = this.selectedFlightId();
    if (!id) return null;
    return this.allFlights().find(f => f.id === id) || null;
  });

  ngOnInit(): void {
    // Read URL params for search criteria
    this.route.queryParams.subscribe(params => {
      console.log('Search params:', params);

      // Build search criteria from params
      const criteria: SearchCriteria = {
        ...DEFAULT_SEARCH_CRITERIA,
        tripType: (params['tripType'] as 'round-trip' | 'one-way') || 'round-trip',
        passengers: {
          adults: parseInt(params['adults'] || '1', 10),
          children: parseInt(params['children'] || '0', 10)
        },
        departureDate: params['departureDate'] ? new Date(params['departureDate']) : null,
        returnDate: params['returnDate'] ? new Date(params['returnDate']) : null,
        origin: null,
        destination: null
      };

      // Extract destination city from airport code
      const destinationCode = params['destination'];
      if (destinationCode) {
        this.airportService.getByCode(destinationCode).subscribe(airport => {
          if (airport) {
            this.destinationCity.set(airport.city);
            criteria.destination = airport;
            this.searchCriteria.set(criteria);
          }
        });
      }

      // Extract origin from airport code
      const originCode = params['origin'];
      if (originCode) {
        this.airportService.getByCode(originCode).subscribe(airport => {
          if (airport) {
            criteria.origin = airport;
            this.searchCriteria.set(criteria);
          }
        });
      }

      this.searchCriteria.set(criteria);
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

  bookFlight(): void {
    const flight = this.selectedFlight();
    if (!flight) return;

    // Initialize booking with selected flight and search criteria
    this.bookingService.initializeBooking(
      flight,
      this.searchCriteria()
    );

    // Navigate to passenger info page
    this.router.navigate(['/passenger-info']);
  }
}
