import { Component, signal, computed, inject, input, OnInit, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { TripTypeSelectorComponent } from './trip-type-selector/trip-type-selector.component';
import { LocationInputComponent } from './location-input/location-input.component';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { PassengerSelectorComponent } from './passenger-selector/passenger-selector.component';
import { Airport } from '../../models/airport.model';
import { AirportService } from '../../services/airport.service';
import {
  TripType,
  PassengerCount,
  SearchCriteria,
  toQueryParams,
  fromQueryParams,
  formatPassengers
} from '../../models/search-criteria.model';

interface ValidationErrors {
  origin?: string;
  destination?: string;
  departureDate?: string;
  returnDate?: string;
  sameLocation?: string;
}

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [
    CommonModule,
    TripTypeSelectorComponent,
    LocationInputComponent,
    DatePickerComponent,
    PassengerSelectorComponent
  ],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss',
  host: {
    '[class.compact-search]': 'compact()'
  }
})
export class SearchFormComponent implements OnInit {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private airportService = inject(AirportService);

  // Input for compact mode on search results page
  compact = input<boolean>(false);

  // Form state
  tripType = signal<TripType>('round-trip');
  origin = signal<Airport | null>(null);
  destination = signal<Airport | null>(null);
  departureDate = signal<Date | null>(null);
  returnDate = signal<Date | null>(null);
  passengers = signal<PassengerCount>({ adults: 1, children: 0 });

  // Validation state
  errors = signal<ValidationErrors>({});
  submitted = signal(false);

  // Computed values
  isRoundTrip = computed(() => this.tripType() === 'round-trip');
  passengersDisplay = computed(() => formatPassengers(this.passengers()));

  ngOnInit(): void {
    // In compact mode, pre-fill from URL query params
    if (this.compact()) {
      this.route.queryParams.subscribe(params => {
        this.prefillFromParams(params);
      });
    }
  }

  private prefillFromParams(params: Record<string, string>): void {
    const airports = this.airportService.getAllAirports();
    const criteria = fromQueryParams(params, airports);

    if (criteria.tripType) {
      this.tripType.set(criteria.tripType);
    }
    if (criteria.origin) {
      this.origin.set(criteria.origin);
    }
    if (criteria.destination) {
      this.destination.set(criteria.destination);
    }
    if (criteria.departureDate) {
      this.departureDate.set(criteria.departureDate);
    }
    if (criteria.returnDate) {
      this.returnDate.set(criteria.returnDate);
    }
    if (criteria.passengers) {
      this.passengers.set(criteria.passengers);
    }
  }

  // Build search criteria
  private getSearchCriteria(): SearchCriteria {
    return {
      tripType: this.tripType(),
      origin: this.origin(),
      destination: this.destination(),
      departureDate: this.departureDate(),
      returnDate: this.returnDate(),
      passengers: this.passengers()
    };
  }

  // Validation
  private validate(): boolean {
    const errors: ValidationErrors = {};

    if (!this.origin()) {
      errors.origin = 'Please select origin';
    }

    if (!this.destination()) {
      errors.destination = 'Please select destination';
    }

    if (this.origin() && this.destination() &&
        this.origin()!.code === this.destination()!.code) {
      errors.sameLocation = 'Origin and destination must be different';
    }

    if (!this.departureDate()) {
      errors.departureDate = 'Please select departure date';
    }

    if (this.isRoundTrip() && !this.returnDate()) {
      errors.returnDate = 'Please select return date';
    }

    if (this.departureDate() && this.returnDate() &&
        this.returnDate()! < this.departureDate()!) {
      errors.returnDate = 'Return date must be after departure date';
    }

    this.errors.set(errors);
    return Object.keys(errors).length === 0;
  }

  // Event handlers
  onTripTypeChange(type: TripType): void {
    this.tripType.set(type);
    if (type === 'one-way') {
      this.returnDate.set(null);
    }
    this.clearError('returnDate');
  }

  onOriginChange(airport: Airport | null): void {
    this.origin.set(airport);
    this.clearError('origin');
    this.clearError('sameLocation');
  }

  onDestinationChange(airport: Airport | null): void {
    this.destination.set(airport);
    this.clearError('destination');
    this.clearError('sameLocation');
  }

  onDepartureDateChange(date: Date | null): void {
    this.departureDate.set(date);
    this.clearError('departureDate');

    // Adjust return date if needed
    if (date && this.returnDate() && this.returnDate()! < date) {
      this.returnDate.set(null);
    }
  }

  onReturnDateChange(date: Date | null): void {
    this.returnDate.set(date);
    this.clearError('returnDate');
  }

  onPassengersChange(passengers: PassengerCount): void {
    this.passengers.set(passengers);
  }

  swapLocations(): void {
    const currentOrigin = this.origin();
    const currentDestination = this.destination();
    this.origin.set(currentDestination);
    this.destination.set(currentOrigin);
    this.clearError('sameLocation');
  }

  onSubmit(): void {
    this.submitted.set(true);

    if (!this.validate()) {
      return;
    }

    const criteria = this.getSearchCriteria();
    const queryParams = toQueryParams(criteria);

    this.router.navigate(['/search'], { queryParams });
  }

  private clearError(key: keyof ValidationErrors): void {
    if (this.submitted()) {
      this.errors.update(errors => {
        const newErrors = { ...errors };
        delete newErrors[key];
        return newErrors;
      });
    }
  }

  hasError(key: keyof ValidationErrors): boolean {
    return this.submitted() && !!this.errors()[key];
  }

  getError(key: keyof ValidationErrors): string {
    return this.errors()[key] || '';
  }
}
