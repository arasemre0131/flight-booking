// Airline Route Model - 011-airline-dashboard

export interface AirlineRoute {
  id: string;
  airlineId: string;
  originAirport: string;      // IATA code (e.g., "VCE")
  destinationAirport: string; // IATA code (e.g., "LHR")
  flightNumberPrefix: string; // e.g., "AZ100"
  isActive: boolean;
  createdAt: string;          // ISO datetime
  updatedAt: string;          // ISO datetime
}

export interface CreateRouteDto {
  originAirport: string;
  destinationAirport: string;
  flightNumberPrefix: string;
}

export interface UpdateRouteDto {
  originAirport?: string;
  destinationAirport?: string;
  flightNumberPrefix?: string;
  isActive?: boolean;
}
