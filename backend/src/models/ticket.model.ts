import mongoose, { Document, Schema } from 'mongoose';

export type TicketStatus = 'active' | 'cancelled';

export interface ITicket extends Document {
  _id: mongoose.Types.ObjectId;
  bookingId: mongoose.Types.ObjectId;
  flightId: mongoose.Types.ObjectId;
  passengerIndex: number;
  seatNumber: string;
  ticketNumber: string;
  status: TicketStatus;
  createdAt: Date;
}

const ticketSchema = new Schema<ITicket>(
  {
    bookingId: {
      type: Schema.Types.ObjectId,
      ref: 'Booking',
      required: true,
    },
    flightId: {
      type: Schema.Types.ObjectId,
      ref: 'Flight',
      required: true,
    },
    passengerIndex: {
      type: Number,
      required: true,
      min: 0,
    },
    seatNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ['active', 'cancelled'],
      default: 'active',
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  }
);

// Indexes
ticketSchema.index({ bookingId: 1 });
ticketSchema.index({ flightId: 1 });

// Unique index for seat locking (only active tickets)
ticketSchema.index(
  { flightId: 1, seatNumber: 1 },
  {
    unique: true,
    partialFilterExpression: { status: 'active' },
  }
);

// Counter for ticket numbers
let ticketCounter = 0;

export async function generateTicketNumber(): Promise<string> {
  const year = new Date().getFullYear();
  ticketCounter++;
  const count = await Ticket.countDocuments();
  const number = String(count + ticketCounter).padStart(6, '0');
  return `SKY-${year}-${number}`;
}

export const Ticket = mongoose.model<ITicket>('Ticket', ticketSchema);
