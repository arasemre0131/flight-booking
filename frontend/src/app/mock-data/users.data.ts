import { User } from '../models/auth.model';

// Mock user type with password for testing (not exposed to UI)
interface MockUser extends User {
  password: string;
  createdAt?: string;
}

export const MOCK_USERS: MockUser[] = [
  {
    id: 'user-001',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    role: 'passenger',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-002',
    email: 'john@example.com',
    password: 'john1234',
    firstName: 'John',
    lastName: 'Doe',
    role: 'passenger',
    status: 'active',
    createdAt: '2025-01-15T00:00:00Z'
  },
  {
    id: 'user-003',
    email: 'airline@example.com',
    password: 'airline123',
    firstName: 'Airline',
    lastName: 'Operator',
    role: 'airline',
    status: 'active',
    airlineId: 'airline-hawaiian',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-004',
    email: 'admin@example.com',
    password: 'admin123',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    status: 'active',
    createdAt: '2025-01-01T00:00:00Z'
  }
];
