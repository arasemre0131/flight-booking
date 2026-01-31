// Aircraft Model - 011-airline-dashboard

export interface SeatClassConfig {
  rows: number;           // 1-50
  seatsPerRow: number;    // 1-10
  totalSeats: number;     // Calculated: rows * seatsPerRow
}

export interface Aircraft {
  id: string;
  airlineId: string;
  model: string;                              // e.g., "Airbus A320"
  registration: string;                       // e.g., "I-ABCD"
  economyConfig: SeatClassConfig;
  businessConfig: SeatClassConfig | null;     // Optional
  firstClassConfig: SeatClassConfig | null;   // Optional
  totalSeats: number;                         // Sum of all class seats
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAircraftDto {
  model: string;
  registration: string;
  economyConfig: Omit<SeatClassConfig, 'totalSeats'>;
  businessConfig?: Omit<SeatClassConfig, 'totalSeats'> | null;
  firstClassConfig?: Omit<SeatClassConfig, 'totalSeats'> | null;
}

export interface UpdateAircraftDto {
  model?: string;
  registration?: string;
  economyConfig?: Omit<SeatClassConfig, 'totalSeats'>;
  businessConfig?: Omit<SeatClassConfig, 'totalSeats'> | null;
  firstClassConfig?: Omit<SeatClassConfig, 'totalSeats'> | null;
  isActive?: boolean;
}

// Helper function to calculate total seats
export function calculateTotalSeats(
  economy: { rows: number; seatsPerRow: number },
  business?: { rows: number; seatsPerRow: number } | null,
  firstClass?: { rows: number; seatsPerRow: number } | null
): number {
  let total = economy.rows * economy.seatsPerRow;
  if (business) {
    total += business.rows * business.seatsPerRow;
  }
  if (firstClass) {
    total += firstClass.rows * firstClass.seatsPerRow;
  }
  return total;
}

// Helper to create SeatClassConfig with calculated total
export function createSeatClassConfig(rows: number, seatsPerRow: number): SeatClassConfig {
  return {
    rows,
    seatsPerRow,
    totalSeats: rows * seatsPerRow
  };
}
