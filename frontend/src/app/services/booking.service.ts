import { Injectable, signal, computed } from '@angular/core';
import { Flight } from '../models/flight.model';
import { SearchCriteria } from '../models/search-criteria.model';
import { Passenger } from '../models/passenger.model';
import { BookingDraft, EmergencyContact, generateBookingId, calculateTotalPrice } from '../models/booking.model';
import { SeatAssignment, calculateSeatFees } from '../models/seat.model';
import { PaymentDetails, BillingAddress, PriceSummary } from '../models/payment.model';

const STORAGE_KEY = 'skyroute_booking_draft';

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
    const taxesAndFees = Math.round(baseFare * 0.10); // 10% mock tax

    return {
      baseFare,
      seatFees,
      taxesAndFees,
      total: baseFare + seatFees + taxesAndFees
    };
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
