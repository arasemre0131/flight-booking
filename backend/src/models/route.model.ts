import mongoose, { Document, Schema } from 'mongoose';

export interface IRoute extends Document {
  _id: mongoose.Types.ObjectId;
  airlineId: mongoose.Types.ObjectId;
  originAirport: string;
  destinationAirport: string;
  flightNumber: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const routeSchema = new Schema<IRoute>(
  {
    airlineId: {
      type: Schema.Types.ObjectId,
      ref: 'Airline',
      required: true,
    },
    originAirport: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
    },
    destinationAirport: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
      minlength: 3,
      maxlength: 3,
    },
    flightNumber: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

routeSchema.index({ airlineId: 1 });
routeSchema.index({ originAirport: 1, destinationAirport: 1 });

export const Route = mongoose.model<IRoute>('Route', routeSchema);
