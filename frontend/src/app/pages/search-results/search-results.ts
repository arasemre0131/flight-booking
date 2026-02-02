import { Component, signal, computed, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { FlightCard } from '../../components/flight-card/flight-card';
import { FilterBar } from '../../components/filter-bar/filter-bar';
import { SidebarContent } from '../../components/sidebar-content/sidebar-content';
import { Flight } from '../../models/flight.model';
import { FilterState, DEFAULT_FILTER_STATE } from '../../models/filter.model';
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

  // All flights - now loaded from backend API
  private allFlights = signal<Flight[]>([]);

  // Search criteria from URL
  private searchCriteria = signal<SearchCriteria>(DEFAULT_SEARCH_CRITERIA);

  // Filter state
  filters = signal<FilterState>(DEFAULT_FILTER_STATE);

  // UI state
  showAllFlights = signal(false);
  selectedFlightId = signal<string | null>(null);
  isLoading = signal(true);
  searchError = signal<string | null>(null);

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

      const originCode = params['origin'];
      const destinationCode = params['destination'];
      const departureDate = params['departureDate'];

      // Build base search criteria
      const criteria: SearchCriteria = {
        ...DEFAULT_SEARCH_CRITERIA,
        tripType: (params['tripType'] as 'round-trip' | 'one-way') || 'round-trip',
        passengers: {
          adults: parseInt(params['adults'] || '1', 10),
          children: parseInt(params['children'] || '0', 10)
        },
        departureDate: departureDate ? new Date(departureDate) : null,
        returnDate: params['returnDate'] ? new Date(params['returnDate']) : null,
        origin: null,
        destination: null
      };

      // Use forkJoin to wait for both airport lookups before proceeding
      const origin$ = originCode ? this.airportService.getByCode(originCode) : of(null);
      const destination$ = destinationCode ? this.airportService.getByCode(destinationCode) : of(null);

      forkJoin([origin$, destination$]).subscribe(([originAirport, destAirport]) => {
        if (originAirport) {
          criteria.origin = originAirport;
        }
        if (destAirport) {
          criteria.destination = destAirport;
          this.destinationCity.set(destAirport.city);
        }

        // Set the complete criteria
        this.searchCriteria.set(criteria);

        // Now search for flights using backend API
        if (originCode && destinationCode) {
          // Pass date if provided, otherwise undefined to get all flights
          this.searchFlightsFromBackend(originCode, destinationCode, departureDate || undefined, criteria);
        } else {
          // If missing required params, show no flights
          this.allFlights.set([]);
          this.isLoading.set(false);
        }
      });
    });
  }

  private searchFlightsFromBackend(
    origin: string,
    destination: string,
    date: string | undefined,
    criteria: SearchCriteria
  ): void {
    this.isLoading.set(true);
    this.searchError.set(null);

    const totalPassengers = criteria.passengers.adults + criteria.passengers.children;

    this.bookingService.searchFlights(origin, destination, date, totalPassengers).subscribe({
      next: (results) => {
        // Convert backend results to frontend Flight format - show only real flights
        const flights = results.map(result => this.bookingService.convertBackendFlightToFrontend(result));
        this.allFlights.set(flights);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Flight search error:', err);
        this.searchError.set('Unable to search flights. Please try again.');
        this.allFlights.set([]);
        this.isLoading.set(false);
      }
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
