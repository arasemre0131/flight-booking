import { User } from '../models/auth.model';

export const MOCK_USERS: User[] = [
  {
    id: 'user-001',
    email: 'test@example.com',
    password: 'password123',
    firstName: 'Test',
    lastName: 'User',
    createdAt: '2025-01-01T00:00:00Z'
  },
  {
    id: 'user-002',
    email: 'john@example.com',
    password: 'john1234',
    firstName: 'John',
    lastName: 'Doe',
    createdAt: '2025-01-15T00:00:00Z'
  }
];
