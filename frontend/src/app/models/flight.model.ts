// Flight Model for Search Results

export interface Airline {
  code: string;
  name: string;
  logo?: string;
}

export interface Layover {
  airport: string;
  duration: string;
}

export interface Flight {
  id: string;
  airline: Airline;
  departureTime: string;
  arrivalTime: string;
  departureAirport: string;
  arrivalAirport: string;
  duration: string;
  stops: number;
  layovers?: Layover[];
  price: number;
}

// Helper function to display stops
export function getStopsDisplay(flight: Flight): string {
  if (flight.stops === 0) return 'Nonstop';
  if (flight.stops === 1) return '1 stop';
  return `${flight.stops} stops`;
}

// Helper function to display layover info
export function getLayoverDisplay(layover: Layover): string {
  return `${layover.duration} in ${layover.airport}`;
}
