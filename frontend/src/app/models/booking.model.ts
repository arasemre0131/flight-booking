// Booking Models for Passenger Information Flow

import { Flight } from './flight.model';
import { SearchCriteria } from './search-criteria.model';
import { Passenger } from './passenger.model';
import { SeatAssignment } from './seat.model';
import { PaymentDetails, BillingAddress } from './payment.model';

export interface EmergencyContact {
  name: string;
  phone: string;
}

export interface BookingDraft {
  id: string;
  selectedFlight: Flight;
  returnFlight?: Flight;
  passengers: Passenger[];
  emergencyContact?: EmergencyContact;
  totalPrice: number;
  searchCriteria: SearchCriteria;
  seatAssignments?: SeatAssignment[];
  seatFees?: number;
  // Payment fields (008-payment)
  paymentDetails?: PaymentDetails;
  billingAddress?: BillingAddress;
  confirmationNumber?: string;
}

// Helper to generate unique booking draft ID
export function generateBookingId(): string {
  return `booking-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to calculate total price
export function calculateTotalPrice(
  selectedFlight: Flight,
  returnFlight: Flight | undefined,
  passengerCount: number
): number {
  const outboundTotal = selectedFlight.price * passengerCount;
  const returnTotal = returnFlight ? returnFlight.price * passengerCount : 0;
  return outboundTotal + returnTotal;
}
