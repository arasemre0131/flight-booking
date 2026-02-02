import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of, firstValueFrom } from 'rxjs';
import { Flight } from '../models/flight.model';
import { SearchCriteria } from '../models/search-criteria.model';
import { Passenger } from '../models/passenger.model';
import { BookingDraft, EmergencyContact, generateBookingId, calculateTotalPrice } from '../models/booking.model';
import { SeatAssignment, calculateSeatFees } from '../models/seat.model';
import { PaymentDetails, BillingAddress, PriceSummary } from '../models/payment.model';
import { environment } from '../../environments/environment';

const STORAGE_KEY = 'skyroute_booking_draft';

// Backend API response types
export interface FlightSearchResult {
  type: 'direct' | 'connecting';
  pricePerPerson: number;
  totalDuration: number;
  stops: number;
  layover?: { airport: string; city: string; duration: number };
  flights: BackendFlight[];
}

export interface BackendFlight {
  flightId: string;
  flightNumber: string;
  airline: { id: string; name: string; code: string };
  origin: { code: string; city: string };
  destination: { code: string; city: string };
  departureTime: string;
  arrivalTime: string;
  duration: number;
  price: number;
  aircraft: { model: string; seatConfig: string };
  availableSeats: { economy: number; business: number };
}

export interface SearchResponse {
  results: FlightSearchResult[];
  searchParams: any;
}

export interface SeatInfo {
  seatNumber: string;
  row: number;
  column: string;
  class: 'economy' | 'business';
  isAvailable: boolean;
  hasExtraLegroom: boolean;
  price: number;
}

export interface SeatMapResponse {
  flightId: string;
  aircraft: { model: string; seatConfig: string };
  seats: SeatInfo[];
}

export interface BackendBooking {
  id: string;
  status: 'pending' | 'confirmed' | 'cancelled';
  totalPrice: number;
  passengers: number;
  expiresIn?: string;
  flightId?: string;
  ticketClass?: string;
}

export interface ConfirmBookingResponse {
  message: string;
  booking: BackendBooking;
  tickets: string[];
}

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  private _bookingDraft = signal<BookingDraft | null>(null);
  private _backendBookingId = signal<string | null>(null);

  // Public readonly signals
  readonly bookingDraft = this._bookingDraft.asReadonly();
  readonly backendBookingId = this._backendBookingId.asReadonly();

  readonly selectedFlight = computed(() => this._bookingDraft()?.selectedFlight ?? null);
  readonly returnFlight = computed(() => this._bookingDraft()?.returnFlight ?? null);
  readonly passengers = computed(() => this._bookingDraft()?.passengers ?? []);
  readonly emergencyContact = computed(() => this._bookingDraft()?.emergencyContact ?? null);
  readonly totalPrice = computed(() => this._bookingDraft()?.totalPrice ?? 0);
  readonly searchCriteria = computed(() => this._bookingDraft()?.searchCriteria ?? null);
  readonly seatAssignments = computed(() => this._bookingDraft()?.seatAssignments ?? []);
  readonly seatFees = computed(() => this._bookingDraft()?.seatFees ?? 0);

  // Payment signals (008-payment)
  readonly paymentDetails = computed(() => this._bookingDraft()?.paymentDetails ?? null);
  readonly billingAddress = computed(() => this._bookingDraft()?.billingAddress ?? null);
  readonly confirmationNumber = computed(() => this._bookingDraft()?.confirmationNumber ?? null);

  // Total price including seat fees
  readonly totalWithSeatFees = computed(() => this.totalPrice() + this.seatFees());

  constructor() {
    this.restoreFromStorage();
  }

  // ============================================
  // Backend API Methods
  // ============================================

  /**
   * Search flights from backend
   */
  searchFlights(
    origin: string,
    destination: string,
    date: string,
    passengers: number = 1,
    ticketClass: 'economy' | 'business' = 'economy'
  ): Observable<FlightSearchResult[]> {
    const params = new URLSearchParams({
      origin,
      destination,
      date,
      passengers: passengers.toString(),
      class: ticketClass
    });

    return this.http.get<SearchResponse>(`${this.API_URL}/flights/search?${params}`).pipe(
      map(response => response.results),
      catchError(error => {
        console.error('Flight search error:', error);
        return of([]);
      })
    );
  }

  /**
   * Get seat map for a flight
   */
  getFlightSeats(flightId: string): Observable<SeatMapResponse | null> {
    return this.http.get<SeatMapResponse>(`${this.API_URL}/flights/${flightId}/seats`).pipe(
      catchError(error => {
        console.error('Get seats error:', error);
        return of(null);
      })
    );
  }

  /**
   * Create booking on backend
   */
  async createBackendBooking(
    flightId: string,
    passengers: Array<{
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      dateOfBirth: string;
      passportNumber: string;
    }>,
    ticketClass: 'economy' | 'business' = 'economy',
    extras: { additionalBaggage?: number; extraLegroom?: boolean } = {}
  ): Promise<BackendBooking | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ message: string; booking: BackendBooking }>(
          `${this.API_URL}/bookings`,
          { flightId, passengers, ticketClass, extras }
        )
      );
      this._backendBookingId.set(response.booking.id);
      return response.booking;
    } catch (error) {
      console.error('Create booking error:', error);
      return null;
    }
  }

  /**
   * Select seats on backend
   */
  async selectSeatsOnBackend(
    bookingId: string,
    assignments: Array<{ passengerIndex: number; seatNumber: string }>
  ): Promise<BackendBooking | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<{ message: string; booking: BackendBooking }>(
          `${this.API_URL}/bookings/${bookingId}/seats`,
          { assignments }
        )
      );
      return response.booking;
    } catch (error) {
      console.error('Select seats error:', error);
      return null;
    }
  }

  /**
   * Confirm booking with payment
   */
  async confirmBookingWithPayment(
    bookingId: string,
    cardDetails: {
      number: string;
      expiry: string;
      cvv: string;
      name: string;
    }
  ): Promise<ConfirmBookingResponse | null> {
    try {
      const response = await firstValueFrom(
        this.http.post<ConfirmBookingResponse>(
          `${this.API_URL}/bookings/${bookingId}/confirm`,
          { paymentMethod: 'card', cardDetails }
        )
      );
      return response;
    } catch (error) {
      console.error('Confirm booking error:', error);
      return null;
    }
  }

  /**
   * Cancel a booking
   */
  async cancelBooking(bookingId: string): Promise<boolean> {
    try {
      await firstValueFrom(
        this.http.delete(`${this.API_URL}/bookings/${bookingId}`)
      );
      return true;
    } catch (error) {
      console.error('Cancel booking error:', error);
      return false;
    }
  }

  /**
   * Get user's bookings
   */
  getUserBookings(): Observable<any[]> {
    return this.http.get<{ bookings: any[] }>(`${this.API_URL}/bookings`).pipe(
      map(response => response.bookings),
      catchError(error => {
        console.error('Get bookings error:', error);
        return of([]);
      })
    );
  }

  /**
   * Get booking details
   */
  getBookingDetails(bookingId: string): Observable<any | null> {
    return this.http.get<any>(`${this.API_URL}/bookings/${bookingId}`).pipe(
      catchError(error => {
        console.error('Get booking details error:', error);
        return of(null);
      })
    );
  }

  // ============================================
  // Frontend Draft Management (unchanged)
  // ============================================

  // Initialize booking with selected flight
  initializeBooking(
    selectedFlight: Flight,
    searchCriteria: SearchCriteria,
    returnFlight?: Flight
  ): void {
    const passengerCount = searchCriteria.passengers.adults + searchCriteria.passengers.children;

    const draft: BookingDraft = {
      id: generateBookingId(),
      selectedFlight,
      returnFlight,
      passengers: [],
      totalPrice: calculateTotalPrice(selectedFlight, returnFlight, passengerCount),
      searchCriteria
    };

    this._bookingDraft.set(draft);
    this._backendBookingId.set(null);
    this.saveToStorage();
  }

  // Update passengers
  updatePassengers(passengers: Passenger[]): void {
    this._bookingDraft.update(draft => {
      if (!draft) return null;
      return { ...draft, passengers };
    });
    this.saveToStorage();
  }

  // Update emergency contact
  updateEmergencyContact(emergencyContact: EmergencyContact | undefined): void {
    this._bookingDraft.update(draft => {
      if (!draft) return null;
      return { ...draft, emergencyContact };
    });
    this.saveToStorage();
  }

  // Initialize seat assignments from passengers
  initializeSeatAssignments(): void {
    this._bookingDraft.update(draft => {
      if (!draft) return null;

      // Only initialize if not already set
      if (draft.seatAssignments && draft.seatAssignments.length > 0) {
        return draft;
      }

      const assignments: SeatAssignment[] = draft.passengers.map(p => ({
        passengerId: p.id,
        passengerName: `${p.firstName} ${p.lastName}`,
        seatId: null,
        seat: null
      }));

      return {
        ...draft,
        seatAssignments: assignments,
        seatFees: 0
      };
    });
    this.saveToStorage();
  }

  // Update seat assignments
  updateSeatAssignments(assignments: SeatAssignment[]): void {
    this._bookingDraft.update(draft => {
      if (!draft) return null;
      const seatFees = calculateSeatFees(assignments);
      return {
        ...draft,
        seatAssignments: assignments,
        seatFees
      };
    });
    this.saveToStorage();
  }

  // Update payment details (008-payment)
  // Note: Do NOT persist card details to storage for security
  updatePaymentDetails(paymentDetails: PaymentDetails): void {
    this._bookingDraft.update(draft => {
      if (!draft) return null;
      return { ...draft, paymentDetails };
    });
    // Intentionally not saving to storage for security
  }

  // Update billing address (008-payment)
  updateBillingAddress(billingAddress: BillingAddress): void {
    this._bookingDraft.update(draft => {
      if (!draft) return null;
      return { ...draft, billingAddress };
    });
    this.saveToStorage();
  }

  // Set confirmation number after successful payment (008-payment)
  setConfirmationNumber(confirmationNumber: string): void {
    this._bookingDraft.update(draft => {
      if (!draft) return null;
      return { ...draft, confirmationNumber };
    });
    this.saveToStorage();
  }

  // Update extras (baggage)
  updateExtras(additionalBaggage: number): void {
    const BAGGAGE_PRICE = 35; // $35 per extra bag
    this._bookingDraft.update(draft => {
      if (!draft) return null;
      return {
        ...draft,
        extras: {
          additionalBaggage,
          baggagePrice: additionalBaggage * BAGGAGE_PRICE
        }
      };
    });
    this.saveToStorage();
  }

  // Get extras
  readonly extras = computed(() => this._bookingDraft()?.extras ?? null);

  // Calculate price summary with taxes (008-payment)
  calculatePriceSummary(): PriceSummary {
    const draft = this._bookingDraft();
    if (!draft) {
      return { baseFare: 0, seatFees: 0, taxesAndFees: 0, total: 0 };
    }

    const passengerCount = draft.passengers.length || 1;
    const outbound = draft.selectedFlight.price * passengerCount;
    const returnPrice = draft.returnFlight ? draft.returnFlight.price * passengerCount : 0;
    const baseFare = outbound + returnPrice;
    const seatFees = draft.seatFees ?? 0;
    const baggageFees = draft.extras?.baggagePrice ?? 0;
    const taxesAndFees = Math.round(baseFare * 0.10); // 10% mock tax

    return {
      baseFare,
      seatFees,
      baggageFees,
      taxesAndFees,
      total: baseFare + seatFees + baggageFees + taxesAndFees
    };
  }

  // Clear booking
  clearBooking(): void {
    this._bookingDraft.set(null);
    this._backendBookingId.set(null);
    this.clearStorage();
  }

  // Session storage persistence
  private saveToStorage(): void {
    const draft = this._bookingDraft();
    if (draft) {
      try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
      } catch (e) {
        console.warn('Failed to save booking to session storage:', e);
      }
    }
  }

  private restoreFromStorage(): void {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY);
      if (stored) {
        const draft = JSON.parse(stored) as BookingDraft;
        // Restore Date objects
        if (draft.passengers) {
          draft.passengers = draft.passengers.map(p => ({
            ...p,
            dateOfBirth: new Date(p.dateOfBirth)
          }));
        }
        this._bookingDraft.set(draft);
      }
    } catch (e) {
      console.warn('Failed to restore booking from session storage:', e);
    }
  }

  private clearStorage(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch (e) {
      console.warn('Failed to clear booking from session storage:', e);
    }
  }

  // ============================================
  // Helper: Convert backend flight to frontend format
  // ============================================

  convertBackendFlightToFrontend(result: FlightSearchResult): Flight {
    const flight = result.flights[0];
    const formatTime = (dateStr: string) => {
      const d = new Date(dateStr);
      return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    };

    const formatDuration = (minutes: number) => {
      const h = Math.floor(minutes / 60);
      const m = minutes % 60;
      return `${h}h ${m}m`;
    };

    return {
      id: flight.flightId,
      airline: {
        code: flight.airline.code,
        name: flight.airline.name
      },
      departureTime: formatTime(flight.departureTime),
      arrivalTime: formatTime(result.flights[result.flights.length - 1].arrivalTime),
      departureAirport: flight.origin.code,
      arrivalAirport: result.flights[result.flights.length - 1].destination.code,
      duration: formatDuration(result.totalDuration),
      stops: result.stops,
      layovers: result.layover ? [{
        airport: result.layover.airport,
        duration: formatDuration(result.layover.duration)
      }] : undefined,
      price: result.pricePerPerson
    };
  }
}
