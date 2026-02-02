// Mock Seat Map Data for Aircraft Layout
import { Seat, SeatRow, SeatMap, SeatType, SeatClass } from '../models/seat.model';

// Pre-defined occupied seats for realistic appearance
const OCCUPIED_SEATS = new Set([
  '1A',                       // First class
  '3D', '4B',                 // Business
  '12A', '12F', '22C',        // Exit
  '7C', '9A', '10E', '14B', '17F', '20D', '24A', '26C'  // Economy
]);

// Seat pricing by type (upgrade prices)
const SEAT_PRICES: Record<SeatType, number> = {
  first: 0,      // First class - no extra upgrade, base price is already premium
  business: 0,   // Business - no extra upgrade
  economy: 0,    // Economy standard
  exit: 50       // Exit row - extra legroom fee
};

function getSeatClass(type: SeatType): SeatClass {
  if (type === 'first') return 'first';
  if (type === 'business') return 'business';
  return 'economy';
}

function createSeat(row: number, letter: string, type: SeatType, hasExtraLegroom: boolean = false): Seat {
  const id = `${row}${letter}`;
  return {
    id,
    row,
    letter,
    status: OCCUPIED_SEATS.has(id) ? 'occupied' : 'available',
    type,
    seatClass: getSeatClass(type),
    upgradePrice: type === 'exit' ? SEAT_PRICES.exit : 0,
    hasExtraLegroom: type === 'first' || type === 'exit' || hasExtraLegroom
  };
}

// First Class: 2 seats per row (A | B) - very spacious, gold/purple
function createFirstClassRow(rowNumber: number): SeatRow {
  return {
    number: rowNumber,
    type: 'first',
    seats: [
      createSeat(rowNumber, 'A', 'first', true),
      'aisle',
      createSeat(rowNumber, 'B', 'first', true)
    ]
  };
}

// Business Class: 4 seats per row (A-B | C-D)
function createBusinessRow(rowNumber: number, isFirstRow: boolean = false): SeatRow {
  return {
    number: rowNumber,
    type: 'business',
    seats: [
      createSeat(rowNumber, 'A', 'business', isFirstRow),
      createSeat(rowNumber, 'B', 'business', isFirstRow),
      'aisle',
      createSeat(rowNumber, 'C', 'business', isFirstRow),
      createSeat(rowNumber, 'D', 'business', isFirstRow)
    ]
  };
}

// Economy Class: 6 seats per row (A-B-C | D-E-F)
function createEconomyRow(rowNumber: number, type: SeatType = 'economy'): SeatRow {
  const isExit = type === 'exit';
  return {
    number: rowNumber,
    type,
    seats: [
      createSeat(rowNumber, 'A', type, isExit),
      createSeat(rowNumber, 'B', type, isExit),
      createSeat(rowNumber, 'C', type, isExit),
      'aisle',
      createSeat(rowNumber, 'D', type, isExit),
      createSeat(rowNumber, 'E', type, isExit),
      createSeat(rowNumber, 'F', type, isExit)
    ]
  };
}

function generateSeatMap(): SeatMap {
  const rows: SeatRow[] = [];

  // First Class: Rows 1-2 (2 seats per row: A | B) - Premium seating at front
  for (let i = 1; i <= 2; i++) {
    rows.push(createFirstClassRow(i));
  }

  // Business class: Rows 3-5 (4 seats per row: A-B | C-D)
  for (let i = 3; i <= 5; i++) {
    rows.push(createBusinessRow(i, i === 3));
  }

  // Economy class: Rows 6-28 (6 seats per row: A-B-C | D-E-F)
  // Exit rows at 12 and 22
  for (let i = 6; i <= 28; i++) {
    if (i === 12 || i === 22) {
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
