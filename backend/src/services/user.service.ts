import { User, IUser } from '../models/user.model';
import { Airline } from '../models/airline.model';
import { hashPassword, generateTempPassword } from '../utils/password.util';

export interface InviteAirlineInput {
  email: string;
  companyName: string;
  airlineCode: string;
}

export interface InviteAirlineResponse {
  user: {
    id: string;
    email: string;
  };
  airline: {
    id: string;
    name: string;
    code: string;
  };
  temporaryPassword: string;
}

export async function inviteAirline(input: InviteAirlineInput): Promise<InviteAirlineResponse> {
  const { email, companyName, airlineCode } = input;

  // Check if email exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Check if airline code exists
  const existingAirline = await Airline.findOne({ code: airlineCode.toUpperCase() });
  if (existingAirline) {
    throw new Error('Airline code already exists');
  }

  // Create airline
  const airline = await Airline.create({
    name: companyName,
    code: airlineCode.toUpperCase(),
    status: 'active',
  });

  // Generate temp password and create user
  const tempPassword = generateTempPassword();
  const hashedPassword = await hashPassword(tempPassword);

  const user = await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    firstName: companyName,
    lastName: 'Admin',
    role: 'airline',
    airlineId: airline._id,
    status: 'active',
    mustChangePassword: true,
  });

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
    },
    airline: {
      id: airline._id.toString(),
      name: airline.name,
      code: airline.code,
    },
    temporaryPassword: tempPassword,
  };
}

export interface UserListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  status: string;
  createdAt: Date;
}

export async function listUsers(): Promise<UserListItem[]> {
  const users = await User.find().sort({ createdAt: -1 });

  return users.map((user) => ({
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status,
    createdAt: user.createdAt,
  }));
}

export async function deleteUser(userId: string): Promise<void> {
  const user = await User.findById(userId);

  if (!user) {
    throw new Error('User not found');
  }

  if (user.role === 'admin') {
    throw new Error('Cannot delete admin users');
  }

  await User.findByIdAndDelete(userId);
}
