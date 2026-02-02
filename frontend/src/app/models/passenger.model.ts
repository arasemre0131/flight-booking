// Passenger Model for Booking Flow

export interface Passenger {
  id: string;
  firstName: string;
  middleName?: string;
  lastName: string;
  suffix?: string;
  dateOfBirth: Date;
  email?: string;
  phone?: string;
  type: 'adult' | 'child';
  isPrimary: boolean;
}

// Helper to generate unique passenger ID
export function generatePassengerId(): string {
  return `pax-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Helper to get passenger label
export function getPassengerLabel(index: number, type: 'adult' | 'child'): string {
  const typeLabel = type === 'adult' ? 'Adult' : 'Child';
  return `${typeLabel} ${index + 1}`;
}
