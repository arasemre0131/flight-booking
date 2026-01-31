import { Injectable, signal, computed } from '@angular/core';
import { Flight } from '../models/flight.model';
import { SearchCriteria } from '../models/search-criteria.model';
import { Passenger } from '../models/passenger.model';
import { BookingDraft, EmergencyContact, generateBookingId, calculateTotalPrice } from '../models/booking.model';

const STORAGE_KEY = 'tripma_booking_draft';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private _bookingDraft = signal<BookingDraft | null>(null);

  // Public readonly signals
  readonly bookingDraft = this._bookingDraft.asReadonly();

  readonly selectedFlight = computed(() => this._bookingDraft()?.selectedFlight ?? null);
  readonly returnFlight = computed(() => this._bookingDraft()?.returnFlight ?? null);
  readonly passengers = computed(() => this._bookingDraft()?.passengers ?? []);
  readonly emergencyContact = computed(() => this._bookingDraft()?.emergencyContact ?? null);
  readonly totalPrice = computed(() => this._bookingDraft()?.totalPrice ?? 0);
  readonly searchCriteria = computed(() => this._bookingDraft()?.searchCriteria ?? null);

  constructor() {
    this.restoreFromStorage();
  }

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

  // Clear booking
  clearBooking(): void {
    this._bookingDraft.set(null);
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
}
