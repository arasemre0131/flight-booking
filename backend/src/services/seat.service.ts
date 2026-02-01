import mongoose from 'mongoose';
import { Aircraft, IAircraft } from '../models/aircraft.model';
import { Flight } from '../models/flight.model';
import { Ticket } from '../models/ticket.model';
import { Booking } from '../models/booking.model';

export interface SeatInfo {
  seatNumber: string;
  row: number;
  column: string;
  class: 'economy' | 'business';
  isAvailable: boolean;
  hasExtraLegroom: boolean;
  price: number;
}

export interface SeatMapResponse {
  flightId: string;
  aircraft: { model: string; seatConfig: string };
  seats: SeatInfo[];
}

const SEAT_COLUMNS = ['A', 'B', 'C', 'D', 'E', 'F'];
const EXTRA_LEGROOM_ROWS = [1, 12, 13]; // First row and exit rows

export function generateSeatMap(aircraft: IAircraft, ticketClass?: 'economy' | 'business'): Omit<SeatInfo, 'isAvailable'>[] {
  const seats: Omit<SeatInfo, 'isAvailable'>[] = [];
  const config = aircraft.seatConfiguration;

  // Business class seats
  for (let row = 1; row <= config.business.rows; row++) {
    for (let col = 0; col < config.business.seatsPerRow; col++) {
      const seatNumber = `${row}${SEAT_COLUMNS[col]}`;
      seats.push({
        seatNumber,
        row,
        column: SEAT_COLUMNS[col],
        class: 'business',
        hasExtraLegroom: row === 1,
        price: 50, // Business extra legroom price
      });
    }
  }

  // Economy class seats (starting after business)
  const economyStartRow = config.business.rows + 1;
  for (let row = economyStartRow; row < economyStartRow + config.economy.rows; row++) {
    for (let col = 0; col < config.economy.seatsPerRow; col++) {
      const seatNumber = `${row}${SEAT_COLUMNS[col]}`;
      const hasExtraLegroom = EXTRA_LEGROOM_ROWS.includes(row);
      seats.push({
        seatNumber,
        row,
        column: SEAT_COLUMNS[col],
        class: 'economy',
        hasExtraLegroom,
        price: hasExtraLegroom ? 50 : 0,
      });
    }
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
  const seatConfig = `${config.business.seatsPerRow}-${config.economy.seatsPerRow}`;

  return {
    flightId,
    aircraft: {
      model: aircraft.aircraftModel,
      seatConfig,
    },
    seats: seatsWithAvailability,
  };
}

export async function validateSeatSelection(
  flightId: string,
  seatNumbers: string[],
  ticketClass: 'economy' | 'business'
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
