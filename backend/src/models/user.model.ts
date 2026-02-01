import mongoose, { Document, Schema } from 'mongoose';

export type UserRole = 'passenger' | 'airline' | 'admin';
export type UserStatus = 'active' | 'inactive';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  airlineId?: mongoose.Types.ObjectId;
  mustChangePassword: boolean;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: String,
      enum: ['passenger', 'airline', 'admin'],
      default: 'passenger',
    },
    airlineId: {
      type: Schema.Types.ObjectId,
      ref: 'Airline',
    },
    mustChangePassword: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ email: 1, status: 1 });

export const User = mongoose.model<IUser>('User', userSchema);
