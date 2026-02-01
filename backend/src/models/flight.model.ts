import mongoose, { Document, Schema } from 'mongoose';

export type FlightStatus = 'scheduled' | 'boarding' | 'departed' | 'arrived' | 'cancelled';

export interface IFlight extends Document {
  _id: mongoose.Types.ObjectId;
  airlineId: mongoose.Types.ObjectId;
  routeId: mongoose.Types.ObjectId;
  aircraftId: mongoose.Types.ObjectId;
  departureTime: Date;
  arrivalTime: Date;
  pricing: {
    economy: number;
    business: number;
  };
  status: FlightStatus;
  createdAt: Date;
  updatedAt: Date;
}

const flightSchema = new Schema<IFlight>(
  {
    airlineId: {
      type: Schema.Types.ObjectId,
      ref: 'Airline',
      required: true,
    },
    routeId: {
      type: Schema.Types.ObjectId,
      ref: 'Route',
      required: true,
    },
    aircraftId: {
      type: Schema.Types.ObjectId,
      ref: 'Aircraft',
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    pricing: {
      economy: { type: Number, default: 0 },
      business: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ['scheduled', 'boarding', 'departed', 'arrived', 'cancelled'],
      default: 'scheduled',
    },
  },
  {
    timestamps: true,
  }
);

flightSchema.index({ airlineId: 1 });
flightSchema.index({ routeId: 1 });
flightSchema.index({ departureTime: 1 });
flightSchema.index({ status: 1 });

export const Flight = mongoose.model<IFlight>('Flight', flightSchema);
