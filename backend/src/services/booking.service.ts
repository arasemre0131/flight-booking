import mongoose from 'mongoose';
import { Booking, IBooking, IPassenger, IExtras, TicketClass } from '../models/booking.model';
import { Ticket, generateTicketNumber } from '../models/ticket.model';
import { Flight } from '../models/flight.model';
import { isSeatAvailable, validateSeatSelection } from './seat.service';

const BAGGAGE_FEE = 30;
const LEGROOM_FEE = 50;

export interface CreateBookingData {
  flightId: string;
  passengers: IPassenger[];
  ticketClass: TicketClass;
  extras: IExtras;
}

export interface SeatAssignment {
  passengerIndex: number;
  seatNumber: string;
}

export interface PaymentDetails {
  paymentMethod: 'card';
  cardDetails: {
    number: string;
    expiry: string;
    cvv: string;
    name: string;
  };
}

export async function calculatePrice(
  flightId: string,
  ticketClass: TicketClass,
  passengerCount: number,
  extras: IExtras
): Promise<number> {
  const flight = await Flight.findById(flightId);
  if (!flight) {
    throw new Error('Flight not found');
  }

  // Map ticket class to pricing field
  const priceKey = ticketClass === 'first' ? 'firstClass' : ticketClass;
  const basePrice = flight.pricing[priceKey] * passengerCount;

  // First class includes 2 free bags, others pay for additional
  const freeBags = ticketClass === 'first' ? 2 : (ticketClass === 'business' ? 1 : 0);
  const chargeableBags = Math.max(0, (extras.additionalBaggage || 0) - freeBags);
  const baggageFee = chargeableBags * BAGGAGE_FEE;

  return basePrice + baggageFee;
}

export async function createBooking(userId: string, data: CreateBookingData): Promise<IBooking> {
  const flight = await Flight.findById(data.flightId);
  if (!flight) {
    throw new Error('Flight not found');
  }

  if (flight.status !== 'scheduled') {
    throw new Error('Flight is not available for booking');
  }

  const totalPrice = await calculatePrice(
    data.flightId,
    data.ticketClass,
    data.passengers.length,
    data.extras
  );

  const booking = new Booking({
    userId: new mongoose.Types.ObjectId(userId),
    flightId: new mongoose.Types.ObjectId(data.flightId),
    passengers: data.passengers,
    ticketClass: data.ticketClass,
    extras: data.extras,
    status: 'pending',
    totalPrice,
  });

  await booking.save();
  return booking;
}

export async function selectSeats(
  bookingId: string,
  userId: string,
  assignments: SeatAssignment[]
): Promise<IBooking> {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.userId.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  if (booking.status !== 'pending') {
    throw new Error('Can only select seats for pending bookings');
  }

  // Validate passenger indices
  for (const assignment of assignments) {
    if (assignment.passengerIndex < 0 || assignment.passengerIndex >= booking.passengers.length) {
      throw new Error(`Invalid passenger index: ${assignment.passengerIndex}`);
    }
  }

  // Validate seats
  const seatNumbers = assignments.map((a) => a.seatNumber);
  const validation = await validateSeatSelection(
    booking.flightId.toString(),
    seatNumbers,
    booking.ticketClass
  );

  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }

  // Delete existing tickets for this booking
  await Ticket.deleteMany({ bookingId: booking._id });

  // Calculate extra legroom fees (first class gets it free)
  let legroomFee = 0;
  const isFirstClass = booking.ticketClass === 'first';

  // Create tickets for each seat assignment
  for (const assignment of assignments) {
    const ticketNumber = await generateTicketNumber();

    // Check if seat has extra legroom (first class always has it free)
    if (!isFirstClass && booking.extras.extraLegroom) {
      const row = parseInt(assignment.seatNumber.replace(/[A-Z]/g, ''));
      // Extra legroom rows depend on class - exit rows for economy
      const hasExtraLegroom = booking.ticketClass === 'economy' ? [1, 12, 13].includes(row) : row === 1;
      if (hasExtraLegroom) {
        legroomFee += LEGROOM_FEE;
      }
    }

    const ticket = new Ticket({
      bookingId: booking._id,
      flightId: booking.flightId,
      passengerIndex: assignment.passengerIndex,
      seatNumber: assignment.seatNumber.toUpperCase(),
      ticketNumber,
      status: 'active',
    });

    await ticket.save();
  }

  // Update total price with legroom fees
  if (legroomFee > 0) {
    booking.totalPrice += legroomFee;
    await booking.save();
  }

  return booking;
}

export async function confirmBooking(
  bookingId: string,
  userId: string,
  payment: PaymentDetails
): Promise<{ booking: IBooking; tickets: string[] }> {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.userId.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  if (booking.status !== 'pending') {
    throw new Error('Booking is not pending');
  }

  // Verify all passengers have seat assignments
  const tickets = await Ticket.find({ bookingId: booking._id, status: 'active' });
  if (tickets.length !== booking.passengers.length) {
    throw new Error('All passengers must have seat assignments before confirming');
  }

  // Mock payment processing (always succeeds)
  // In real app, would integrate with Stripe/PayPal here

  // Update booking status
  booking.status = 'confirmed';
  await booking.save();

  const ticketNumbers = tickets.map((t) => t.ticketNumber);

  return { booking, tickets: ticketNumbers };
}

export async function cancelBooking(bookingId: string, userId: string): Promise<IBooking> {
  const booking = await Booking.findById(bookingId);
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.userId.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  // Check if cancellation is allowed
  if (booking.status === 'cancelled') {
    throw new Error('Booking is already cancelled');
  }

  if (booking.status === 'confirmed') {
    // Check if within 24 hours of confirmation
    const hoursSinceConfirm = (Date.now() - booking.updatedAt.getTime()) / (1000 * 60 * 60);
    if (hoursSinceConfirm > 24) {
      throw new Error('Cannot cancel booking after 24 hours of confirmation');
    }
  }

  // Cancel all tickets (releases seats)
  await Ticket.updateMany(
    { bookingId: booking._id },
    { status: 'cancelled' }
  );

  // Update booking status
  booking.status = 'cancelled';
  await booking.save();

  return booking;
}

export async function getUserBookings(userId: string): Promise<IBooking[]> {
  const bookings = await Booking.find({
    userId: new mongoose.Types.ObjectId(userId),
  })
    .sort({ createdAt: -1 })
    .populate({
      path: 'flightId',
      populate: {
        path: 'routeId'
      }
    });

  return bookings;
}

export async function getBookingById(
  bookingId: string,
  userId: string,
  isAdmin: boolean = false
): Promise<{ booking: IBooking; tickets: any[] }> {
  const booking = await Booking.findById(bookingId).populate('flightId');
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (!isAdmin && booking.userId.toString() !== userId) {
    throw new Error('Unauthorized');
  }

  const tickets = await Ticket.find({ bookingId: booking._id });

  return { booking, tickets };
}
