import mongoose, { Document, Schema } from 'mongoose';

export interface ISeatClassConfig {
  rows: number;
  seatsPerRow: number;
}

export interface ISeatConfiguration {
  firstClass: ISeatClassConfig;
  business: ISeatClassConfig;
  economy: ISeatClassConfig;
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

const seatClassConfigSchema = {
  rows: { type: Number, default: 0 },
  seatsPerRow: { type: Number, default: 0 },
};

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
      firstClass: seatClassConfigSchema,
      business: seatClassConfigSchema,
      economy: {
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
  const firstClass = (this.seatConfiguration.firstClass?.rows || 0) * (this.seatConfiguration.firstClass?.seatsPerRow || 0);
  const business = (this.seatConfiguration.business?.rows || 0) * (this.seatConfiguration.business?.seatsPerRow || 0);
  const economy = this.seatConfiguration.economy.rows * this.seatConfiguration.economy.seatsPerRow;
  this.totalSeats = firstClass + business + economy;
  next();
});

export const Aircraft = mongoose.model<IAircraft>('Aircraft', aircraftSchema);
