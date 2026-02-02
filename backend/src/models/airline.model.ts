import mongoose, { Document, Schema } from 'mongoose';

export type AirlineStatus = 'active' | 'suspended';

export interface IAirline extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  code: string;
  status: AirlineStatus;
  createdAt: Date;
  updatedAt: Date;
}

const airlineSchema = new Schema<IAirline>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true,
      minlength: 2,
      maxlength: 3,
    },
    status: {
      type: String,
      enum: ['active', 'suspended'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Airline = mongoose.model<IAirline>('Airline', airlineSchema);
