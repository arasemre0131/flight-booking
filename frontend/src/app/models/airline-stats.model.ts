// Airline Stats Model - 011-airline-dashboard

export interface DateRange {
  start: string;  // ISO date
  end: string;    // ISO date
}

export type FlightStatus = 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';

export interface FlightPricing {
  economy: number;           // Price in cents
  business: number | null;
  firstClass: number | null;
}

export interface SeatFees {
  aisle: number;
  window: number;
  extraLegroom: number;
}

export interface AirlineFlight {
  id: string;
  airlineId: string;
  routeId: string;
  aircraftId: string;
  flightNumber: string;
  departureTime: string;     // ISO datetime
  arrivalTime: string;       // ISO datetime
  durationMinutes: number;
  status: FlightStatus;
  pricing: FlightPricing;
  seatFees: SeatFees;
  bookedSeats: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlightDto {
  routeId: string;
  aircraftId: string;
  departureTime: string;
  arrivalTime: string;
  pricing: FlightPricing;
  seatFees: SeatFees;
}

export interface UpdateFlightDto {
  routeId?: string;
  aircraftId?: string;
  departureTime?: string;
  arrivalTime?: string;
  pricing?: FlightPricing;
  seatFees?: SeatFees;
}

export interface TopRoute {
  routeId: string;
  origin: string;
  destination: string;
  passengerCount: number;
  revenue: number;
}

export interface RevenueByDay {
  date: string;
  revenue: number;
}

export interface FlightsByStatus {
  scheduled: number;
  completed: number;
  cancelled: number;
}

export interface AirlineStatsSummary {
  totalFlights: number;
  totalPassengers: number;
  totalRevenue: number;       // In cents
  averageLoadFactor: number;  // Percentage (0-100)
}

export interface AirlineStats {
  dateRange: DateRange;
  summary: AirlineStatsSummary;
  topRoutes: TopRoute[];
  revenueByDay: RevenueByDay[];
  flightsByStatus: FlightsByStatus;
}
