// Seat Selection Models

export type SeatStatus = 'available' | 'occupied' | 'selected';
export type SeatType = 'economy' | 'business' | 'exit';

export interface Seat {
  id: string;
  row: number;
  letter: string;
  status: SeatStatus;
  type: SeatType;
  upgradePrice: number;
}

export interface SeatRow {
  number: number;
  type: SeatType;
  seats: (Seat | 'aisle')[];
}

export interface SeatMap {
  aircraftType: string;
  rows: SeatRow[];
}

export interface SeatAssignment {
  passengerId: string;
  passengerName: string;
  seatId: string | null;
  seat?: Seat | null;
}

// Helper to calculate total seat fees
export function calculateSeatFees(assignments: SeatAssignment[]): number {
  return assignments.reduce((total, a) => total + (a.seat?.upgradePrice ?? 0), 0);
}

// Helper to check if seat is selectable
export function isSeatSelectable(seat: Seat): boolean {
  return seat.status === 'available';
}
