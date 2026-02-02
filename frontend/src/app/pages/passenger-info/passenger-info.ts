import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PassengerForm } from '../../components/passenger-form/passenger-form';
import { FlightSummary } from '../../components/flight-summary/flight-summary';
import { EmergencyContactForm } from '../../components/emergency-contact-form/emergency-contact-form';
import { BookingService } from '../../services/booking.service';
import { Passenger } from '../../models/passenger.model';
import { EmergencyContact } from '../../models/booking.model';

interface PassengerSlot {
  index: number;
  type: 'adult' | 'child';
  isPrimary: boolean;
  data: Passenger | null;
  isValid: boolean;
}

@Component({
  selector: 'app-passenger-info',
  standalone: true,
  imports: [CommonModule, PassengerForm, FlightSummary, EmergencyContactForm],
  templateUrl: './passenger-info.html',
  styleUrl: './passenger-info.scss'
})
export class PassengerInfo implements OnInit {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  // Passenger slots based on search criteria
  passengerSlots = signal<PassengerSlot[]>([]);

  // Emergency contact data
  emergencyContactData = signal<EmergencyContact | undefined>(undefined);

  // Form validity tracking
  private validityMap = signal<Map<number, boolean>>(new Map());

  // Computed: Check if all forms are valid
  isFormValid = computed(() => {
    const slots = this.passengerSlots();
    const validity = this.validityMap();
    return slots.every((_, index) => validity.get(index) === true);
  });

  // Computed: Get booking data
  searchCriteria = this.bookingService.searchCriteria;
  selectedFlight = this.bookingService.selectedFlight;
  returnFlight = this.bookingService.returnFlight;
  totalPrice = this.bookingService.totalPrice;

  // Get passengers count for flight summary
  passengersCount = computed(() => {
    const criteria = this.searchCriteria();
    return criteria ? criteria.passengers : { adults: 1, children: 0 };
  });

  ngOnInit(): void {
    this.initializePassengerSlots();
    this.prefillForLoggedInUser();
  }

  // T036: Placeholder for future auth integration
  // When user authentication is implemented, this method will
  // pre-fill the primary passenger form with saved profile data
  private prefillForLoggedInUser(): void {
    // TODO: Implement when auth service is available
    // const user = this.authService.currentUser();
    // if (user && this.passengerSlots().length > 0) {
    //   const primarySlot = this.passengerSlots()[0];
    //   if (primarySlot.isPrimary) {
    //     primarySlot.data = {
    //       ...primarySlot.data,
    //       firstName: user.firstName,
    //       lastName: user.lastName,
    //       email: user.email,
    //       phone: user.phone
    //     };
    //   }
    // }
  }

  private initializePassengerSlots(): void {
    const criteria = this.searchCriteria();
    if (!criteria) {
      // No booking in progress, redirect to search
      this.router.navigate(['/search']);
      return;
    }

    const slots: PassengerSlot[] = [];
    let adultIndex = 0;
    let childIndex = 0;

    // Create adult slots
    for (let i = 0; i < criteria.passengers.adults; i++) {
      slots.push({
        index: slots.length,
        type: 'adult',
        isPrimary: i === 0, // First adult is primary
        data: null,
        isValid: false
      });
      adultIndex++;
    }

    // Create child slots
    for (let i = 0; i < criteria.passengers.children; i++) {
      slots.push({
        index: slots.length,
        type: 'child',
        isPrimary: false,
        data: null,
        isValid: false
      });
      childIndex++;
    }

    this.passengerSlots.set(slots);

    // Initialize validity map
    const validityMap = new Map<number, boolean>();
    slots.forEach((_, index) => validityMap.set(index, false));
    this.validityMap.set(validityMap);

    // Restore existing passengers from booking service
    const existingPassengers = this.bookingService.passengers();
    if (existingPassengers.length > 0) {
      const updatedSlots = [...slots];
      existingPassengers.forEach((passenger, index) => {
        if (updatedSlots[index]) {
          updatedSlots[index] = { ...updatedSlots[index], data: passenger };
        }
      });
      this.passengerSlots.set(updatedSlots);
    }
  }

  onPassengerChange(index: number, passenger: Passenger): void {
    const slots = [...this.passengerSlots()];
    if (slots[index]) {
      slots[index] = { ...slots[index], data: passenger };
      this.passengerSlots.set(slots);
    }
  }

  onValidityChange(index: number, isValid: boolean): void {
    const validity = new Map(this.validityMap());
    validity.set(index, isValid);
    this.validityMap.set(validity);
  }

  onEmergencyContactChange(contact: EmergencyContact | undefined): void {
    this.emergencyContactData.set(contact);
  }

  onSubmit(): void {
    if (!this.isFormValid()) {
      return;
    }

    // Collect all passengers
    const passengers = this.passengerSlots()
      .map(slot => slot.data)
      .filter((p): p is Passenger => p !== null);

    // Save to booking service
    this.bookingService.updatePassengers(passengers);

    // Save emergency contact if provided
    const emergencyContact = this.emergencyContactData();
    this.bookingService.updateEmergencyContact(emergencyContact);

    // Navigate to seat selection
    this.router.navigate(['/seat-selection']);
  }
}
