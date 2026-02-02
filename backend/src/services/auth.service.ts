import { User, IUser } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password.util';
import { generateToken } from '../utils/jwt.util';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
    status: string;
    airlineId?: string;
    mustChangePassword: boolean;
  };
}

function formatUserResponse(user: IUser, token: string): AuthResponse {
  return {
    token,
    user: {
      id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      status: user.status,
      airlineId: user.airlineId?.toString(),
      mustChangePassword: user.mustChangePassword,
    },
  };
}

export async function register(input: RegisterInput): Promise<AuthResponse> {
  const { email, password, firstName, lastName } = input;

  // Check if email exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    throw new Error('Email already registered');
  }

  // Validate password
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // Create user
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    email: email.toLowerCase(),
    password: hashedPassword,
    firstName,
    lastName,
    role: 'passenger',
    status: 'active',
    mustChangePassword: false,
  });

  const token = generateToken(user);
  return formatUserResponse(user, token);
}

export async function login(input: LoginInput): Promise<AuthResponse> {
  const { email, password } = input;

  // Find user with password field
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user) {
    throw new Error('Invalid credentials');
  }

  // Check password
  const isValid = await comparePassword(password, user.password);
  if (!isValid) {
    throw new Error('Invalid credentials');
  }

  // Check if user is active
  if (user.status !== 'active') {
    throw new Error('Account is inactive');
  }

  const token = generateToken(user);
  return formatUserResponse(user, token);
}

export async function changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw new Error('User not found');
  }

  // If not first login, verify current password
  if (!user.mustChangePassword) {
    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      throw new Error('Invalid current password');
    }
  }

  // Validate new password
  if (newPassword.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // Update password and clear flag
  user.password = await hashPassword(newPassword);
  user.mustChangePassword = false;
  await user.save();
}
