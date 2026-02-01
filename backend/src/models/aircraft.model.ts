import mongoose, { Document, Schema } from 'mongoose';

export interface ISeatConfiguration {
  economy: { rows: number; seatsPerRow: number };
  business: { rows: number; seatsPerRow: number };
}

export interface IAircraft extends Document {
  _id: mongoose.Types.ObjectId;
  airlineId: mongoose.Types.ObjectId;
  aircraftModel: string;
  registration: string;
  seatConfiguration: ISeatConfiguration;
  totalSeats: number;
  createdAt: Date;
  updatedAt: Date;
}

const aircraftSchema = new Schema<IAircraft>(
  {
    airlineId: {
      type: Schema.Types.ObjectId,
      ref: 'Airline',
      required: true,
    },
    aircraftModel: {
      type: String,
      required: true,
      trim: true,
    },
    registration: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
    },
    seatConfiguration: {
      economy: {
        rows: { type: Number, required: true },
        seatsPerRow: { type: Number, required: true },
      },
      business: {
        rows: { type: Number, required: true },
        seatsPerRow: { type: Number, required: true },
      },
    },
    totalSeats: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

aircraftSchema.index({ airlineId: 1 });

// Calculate total seats before saving
aircraftSchema.pre('save', function (next) {
  const economy = this.seatConfiguration.economy.rows * this.seatConfiguration.economy.seatsPerRow;
  const business = this.seatConfiguration.business.rows * this.seatConfiguration.business.seatsPerRow;
  this.totalSeats = economy + business;
  next();
});

export const Aircraft = mongoose.model<IAircraft>('Aircraft', aircraftSchema);
