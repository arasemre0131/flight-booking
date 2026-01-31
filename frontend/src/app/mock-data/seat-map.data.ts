// Mock Seat Map Data for Aircraft Layout
import { Seat, SeatRow, SeatMap, SeatType } from '../models/seat.model';

// Pre-defined occupied seats for realistic appearance
const OCCUPIED_SEATS = new Set([
  '1A', '2D', '3B',           // Business
  '10A', '10F', '20C',        // Exit
  '5C', '7A', '8E', '12B', '15F', '18D', '22A', '24C'  // Economy
]);

// Seat pricing by type
const SEAT_PRICES: Record<SeatType, number> = {
  economy: 0,
  exit: 30,
  business: 100
};

function createSeat(row: number, letter: string, type: SeatType): Seat {
  const id = `${row}${letter}`;
  return {
    id,
    row,
    letter,
    status: OCCUPIED_SEATS.has(id) ? 'occupied' : 'available',
    type,
    upgradePrice: SEAT_PRICES[type]
  };
}

function createBusinessRow(rowNumber: number): SeatRow {
  return {
    number: rowNumber,
    type: 'business',
    seats: [
      createSeat(rowNumber, 'A', 'business'),
      createSeat(rowNumber, 'B', 'business'),
      'aisle',
      createSeat(rowNumber, 'C', 'business'),
      createSeat(rowNumber, 'D', 'business')
    ]
  };
}

function createEconomyRow(rowNumber: number, type: SeatType = 'economy'): SeatRow {
  return {
    number: rowNumber,
    type,
    seats: [
      createSeat(rowNumber, 'A', type),
      createSeat(rowNumber, 'B', type),
      createSeat(rowNumber, 'C', type),
      'aisle',
      createSeat(rowNumber, 'D', type),
      createSeat(rowNumber, 'E', type),
      createSeat(rowNumber, 'F', type)
    ]
  };
}

function generateSeatMap(): SeatMap {
  const rows: SeatRow[] = [];

  // Business class: Rows 1-3 (4 seats per row: A-B | C-D)
  for (let i = 1; i <= 3; i++) {
    rows.push(createBusinessRow(i));
  }

  // Economy class: Rows 4-25 (6 seats per row: A-B-C | D-E-F)
  // Exit rows at 10 and 20
  for (let i = 4; i <= 25; i++) {
    if (i === 10 || i === 20) {
      rows.push(createEconomyRow(i, 'exit'));
    } else {
      rows.push(createEconomyRow(i, 'economy'));
    }
  }

  return {
    aircraftType: 'Boeing 737-800',
    rows
  };
}

export const MOCK_SEAT_MAP: SeatMap = generateSeatMap();

// Helper to get seat by ID
export function getSeatById(seatId: string): Seat | null {
  for (const row of MOCK_SEAT_MAP.rows) {
    for (const seat of row.seats) {
      if (seat !== 'aisle' && seat.id === seatId) {
        return seat;
      }
    }
  }
  return null;
}

// Helper to get all available seats
export function getAvailableSeats(): Seat[] {
  const available: Seat[] = [];
  for (const row of MOCK_SEAT_MAP.rows) {
    for (const seat of row.seats) {
      if (seat !== 'aisle' && seat.status === 'available') {
        available.push(seat);
      }
    }
  }
  return available;
}
