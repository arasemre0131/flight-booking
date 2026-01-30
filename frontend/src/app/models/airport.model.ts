// Airport Model for Flight Search

export interface Airport {
  code: string;      // IATA airport code (e.g., "IST", "LHR")
  name: string;      // Airport name (e.g., "Istanbul Airport")
  city: string;      // City name (e.g., "Istanbul")
  country: string;   // Country name (e.g., "Turkey")
}

// Display format helper
export function formatAirportDisplay(airport: Airport): string {
  return `${airport.city} (${airport.code})`;
}

// Full display with airport name
export function formatAirportFull(airport: Airport): string {
  return `${airport.name} - ${airport.city}, ${airport.country}`;
}
