// Search Criteria Models for Flight Search Form

import { Airport } from './airport.model';

export type TripType = 'round-trip' | 'one-way';

export interface PassengerCount {
  adults: number;    // Age 12+ (minimum 1)
  children: number;  // Age 2-11 (default 0)
}

export interface SearchCriteria {
  tripType: TripType;
  origin: Airport | null;
  destination: Airport | null;
  departureDate: Date | null;
  returnDate: Date | null;
  passengers: PassengerCount;
}

// Default search criteria values
export const DEFAULT_SEARCH_CRITERIA: SearchCriteria = {
  tripType: 'round-trip',
  origin: null,
  destination: null,
  departureDate: null,
  returnDate: null,
  passengers: { adults: 1, children: 0 }
};

// Validation constants
export const MAX_PASSENGERS = 9;
export const MIN_ADULTS = 1;
export const MAX_ADULTS = 9;
export const MIN_CHILDREN = 0;
export const MAX_CHILDREN = 8;

// Helper to get total passengers
export function getTotalPassengers(passengers: PassengerCount): number {
  return passengers.adults + passengers.children;
}

// Helper to format passengers for display
export function formatPassengers(passengers: PassengerCount): string {
  const total = getTotalPassengers(passengers);
  if (total === 1) {
    return '1 adult';
  }

  const parts: string[] = [];
  if (passengers.adults > 0) {
    parts.push(`${passengers.adults} adult${passengers.adults > 1 ? 's' : ''}`);
  }
  if (passengers.children > 0) {
    parts.push(`${passengers.children} child${passengers.children > 1 ? 'ren' : ''}`);
  }
  return parts.join(', ');
}

// Convert search criteria to URL query params
export function toQueryParams(criteria: SearchCriteria): Record<string, string> {
  const params: Record<string, string> = {
    tripType: criteria.tripType,
    adults: criteria.passengers.adults.toString(),
    children: criteria.passengers.children.toString()
  };

  if (criteria.origin) {
    params['origin'] = criteria.origin.code;
  }
  if (criteria.destination) {
    params['destination'] = criteria.destination.code;
  }
  if (criteria.departureDate) {
    params['departureDate'] = criteria.departureDate.toISOString().split('T')[0];
  }
  if (criteria.returnDate && criteria.tripType === 'round-trip') {
    params['returnDate'] = criteria.returnDate.toISOString().split('T')[0];
  }

  return params;
}
