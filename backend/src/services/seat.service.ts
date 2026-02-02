import mongoose from 'mongoose';
import { Aircraft, IAircraft } from '../models/aircraft.model';
import { Flight } from '../models/flight.model';
import { Ticket } from '../models/ticket.model';
import { Booking, TicketClass } from '../models/booking.model';

export interface SeatInfo {
  seatNumber: string;
  row: number;
  column: string;
  class: 'economy' | 'business' | 'first';
  isAvailable: boolean;
  hasExtraLegroom: boolean;
  isWindow: boolean;
  isAisle: boolean;
  price: number;
}

export interface SeatMapResponse {
  flightId: string;
  aircraft: { model: string; seatConfig: string };
  seats: SeatInfo[];
  seatClasses: {
    first: { startRow: number; endRow: number; seatsPerRow: number };
    business: { startRow: number; endRow: number; seatsPerRow: number };
    economy: { startRow: number; endRow: number; seatsPerRow: number };
  };
}

// First class: 2 seats (A, B) - very spacious
const FIRST_CLASS_COLUMNS = ['A', 'B'];
// Business: 4 seats (A, B, C, D)
const BUSINESS_COLUMNS = ['A', 'B', 'C', 'D'];
// Economy: 6 seats (A, B, C, D, E, F)
const ECONOMY_COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];

export function generateSeatMap(aircraft: IAircraft, ticketClass?: TicketClass): Omit<SeatInfo, 'isAvailable'>[] {
  const seats: Omit<SeatInfo, 'isAvailable'>[] = [];
  const config = aircraft.seatConfiguration;

  let currentRow = 1;

  // First Class seats (at the very front)
  const firstClassRows = config.firstClass?.rows || 0;
  const firstClassSeatsPerRow = config.firstClass?.seatsPerRow || 2;
  const firstClassColumns = FIRST_CLASS_COLUMNS.slice(0, firstClassSeatsPerRow);

  for (let i = 0; i < firstClassRows; i++) {
    for (let col = 0; col < firstClassSeatsPerRow; col++) {
      const column = firstClassColumns[col];
      const seatNumber = `${currentRow}${column}`;
      seats.push({
        seatNumber,
        row: currentRow,
        column,
        class: 'first',
        hasExtraLegroom: true, // First class always has extra legroom
        isWindow: col === 0 || col === firstClassSeatsPerRow - 1,
        isAisle: col === firstClassSeatsPerRow - 1 || col === 0, // In 2-seat config, both are aisle
        price: 0, // Extra legroom included in first class
      });
    }
    currentRow++;
  }

  // Business class seats (after first class)
  const businessRows = config.business?.rows || 0;
  const businessSeatsPerRow = config.business?.seatsPerRow || 4;
  const businessColumns = BUSINESS_COLUMNS.slice(0, businessSeatsPerRow);

  for (let i = 0; i < businessRows; i++) {
    for (let col = 0; col < businessSeatsPerRow; col++) {
      const column = businessColumns[col];
      const seatNumber = `${currentRow}${column}`;
      const isFirstBusinessRow = i === 0;
      seats.push({
        seatNumber,
        row: currentRow,
        column,
        class: 'business',
        hasExtraLegroom: isFirstBusinessRow,
        isWindow: col === 0 || col === businessSeatsPerRow - 1,
        isAisle: col === 1 || col === businessSeatsPerRow - 2,
        price: isFirstBusinessRow ? 50 : 0,
      });
    }
    currentRow++;
  }

  // Economy class seats (at the back)
  const economyRows = config.economy.rows;
  const economySeatsPerRow = config.economy.seatsPerRow;
  const economyColumns = ECONOMY_COLUMNS.slice(0, economySeatsPerRow);
  const exitRowOffset = Math.floor(economyRows / 2); // Exit row in middle of economy

  for (let i = 0; i < economyRows; i++) {
    for (let col = 0; col < economySeatsPerRow; col++) {
      const column = economyColumns[col];
      const seatNumber = `${currentRow}${column}`;
      const isExitRow = i === 0 || i === exitRowOffset; // First economy row and middle
      seats.push({
        seatNumber,
        row: currentRow,
        column,
        class: 'economy',
        hasExtraLegroom: isExitRow,
        isWindow: col === 0 || col === economySeatsPerRow - 1,
        isAisle: col === 2 || col === economySeatsPerRow - 3, // Middle aisle
        price: isExitRow ? 50 : 0,
      });
    }
    currentRow++;
  }

  // Filter by class if specified
  if (ticketClass) {
    return seats.filter((s) => s.class === ticketClass);
  }

  return seats;
}

export async function getBookedSeats(flightId: string): Promise<Set<string>> {
  const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

  // Get all active tickets for this flight
  const tickets = await Ticket.find({
    flightId: new mongoose.Types.ObjectId(flightId),
    status: 'active',
  }).select('seatNumber bookingId');

  // Also check pending bookings that haven't expired
  const pendingBookingIds = await Booking.find({
    flightId: new mongoose.Types.ObjectId(flightId),
    status: 'pending',
    createdAt: { $gte: fifteenMinutesAgo },
  }).distinct('_id');

  const bookedSeats = new Set<string>();

  for (const ticket of tickets) {
    // Check if ticket belongs to confirmed booking or valid pending booking
    const booking = await Booking.findById(ticket.bookingId);
    if (booking && (booking.status === 'confirmed' || pendingBookingIds.some((id) => id.equals(ticket.bookingId)))) {
      bookedSeats.add(ticket.seatNumber);
    }
  }

  return bookedSeats;
}

export async function isSeatAvailable(flightId: string, seatNumber: string): Promise<boolean> {
  const bookedSeats = await getBookedSeats(flightId);
  return !bookedSeats.has(seatNumber.toUpperCase());
}

export async function getAvailableSeats(flightId: string): Promise<SeatMapResponse> {
  const flight = await Flight.findById(flightId);
  if (!flight) {
    throw new Error('Flight not found');
  }

  const aircraft = await Aircraft.findById(flight.aircraftId);
  if (!aircraft) {
    throw new Error('Aircraft not found');
  }

  const seatMap = generateSeatMap(aircraft);
  const bookedSeats = await getBookedSeats(flightId);

  const seatsWithAvailability: SeatInfo[] = seatMap.map((seat) => ({
    ...seat,
    isAvailable: !bookedSeats.has(seat.seatNumber),
  }));

  const config = aircraft.seatConfiguration;
  const firstClassRows = config.firstClass?.rows || 0;
  const businessRows = config.business?.rows || 0;
  const economyRows = config.economy.rows;

  // Calculate row ranges for each class
  const firstClassEndRow = firstClassRows;
  const businessStartRow = firstClassEndRow + 1;
  const businessEndRow = firstClassEndRow + businessRows;
  const economyStartRow = businessEndRow + 1;
  const economyEndRow = businessEndRow + economyRows;

  const seatConfig = `${config.firstClass?.seatsPerRow || 0}-${config.business?.seatsPerRow || 0}-${config.economy.seatsPerRow}`;

  return {
    flightId,
    aircraft: {
      model: aircraft.aircraftModel,
      seatConfig,
    },
    seats: seatsWithAvailability,
    seatClasses: {
      first: {
        startRow: 1,
        endRow: firstClassEndRow,
        seatsPerRow: config.firstClass?.seatsPerRow || 0,
      },
      business: {
        startRow: businessStartRow,
        endRow: businessEndRow,
        seatsPerRow: config.business?.seatsPerRow || 0,
      },
      economy: {
        startRow: economyStartRow,
        endRow: economyEndRow,
        seatsPerRow: config.economy.seatsPerRow,
      },
    },
  };
}

export async function validateSeatSelection(
  flightId: string,
  seatNumbers: string[],
  ticketClass: TicketClass
): Promise<{ valid: boolean; errors: string[] }> {
  const errors: string[] = [];
  const bookedSeats = await getBookedSeats(flightId);

  const flight = await Flight.findById(flightId);
  if (!flight) {
    return { valid: false, errors: ['Flight not found'] };
  }

  const aircraft = await Aircraft.findById(flight.aircraftId);
  if (!aircraft) {
    return { valid: false, errors: ['Aircraft not found'] };
  }

  const seatMap = generateSeatMap(aircraft);
  const validSeats = new Map(seatMap.map((s) => [s.seatNumber, s]));

  for (const seatNumber of seatNumbers) {
    const seat = validSeats.get(seatNumber.toUpperCase());

    if (!seat) {
      errors.push(`Seat ${seatNumber} does not exist`);
      continue;
    }

    if (seat.class !== ticketClass) {
      errors.push(`Seat ${seatNumber} is not in ${ticketClass} class`);
      continue;
    }

    if (bookedSeats.has(seatNumber.toUpperCase())) {
      errors.push(`Seat ${seatNumber} is not available`);
    }
  }

  return { valid: errors.length === 0, errors };
}
