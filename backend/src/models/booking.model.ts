import mongoose, { Document, Schema } from 'mongoose';

export type BookingStatus = 'pending' | 'confirmed' | 'cancelled';
export type TicketClass = 'economy' | 'business' | 'first';

export interface IPassenger {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  passportNumber: string;
}

export interface IExtras {
  additionalBaggage: number;
  extraLegroom: boolean;
}

export interface IBooking extends Document {
  _id: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  flightId: mongoose.Types.ObjectId;
  passengers: IPassenger[];
  ticketClass: TicketClass;
  extras: IExtras;
  status: BookingStatus;
  totalPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const passengerSchema = new Schema<IPassenger>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    dateOfBirth: { type: Date, required: true },
    passportNumber: { type: String, required: true, uppercase: true, trim: true },
  },
  { _id: false }
);

const bookingSchema = new Schema<IBooking>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    flightId: {
      type: Schema.Types.ObjectId,
      ref: 'Flight',
      required: true,
    },
    passengers: {
      type: [passengerSchema],
      required: true,
      validate: {
        validator: (v: IPassenger[]) => v.length > 0 && v.length <= 9,
        message: 'Booking must have 1-9 passengers',
      },
    },
    ticketClass: {
      type: String,
      enum: ['economy', 'business', 'first'],
      required: true,
    },
    extras: {
      additionalBaggage: { type: Number, default: 0, min: 0, max: 5 },
      extraLegroom: { type: Boolean, default: false },
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled'],
      default: 'pending',
    },
    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
bookingSchema.index({ userId: 1 });
bookingSchema.index({ flightId: 1 });
bookingSchema.index({ status: 1 });

// TTL index for pending bookings (15 minutes = 900 seconds)
bookingSchema.index(
  { createdAt: 1 },
  {
    expireAfterSeconds: 900,
    partialFilterExpression: { status: 'pending' },
  }
);

export const Booking = mongoose.model<IBooking>('Booking', bookingSchema);
