// Payment Models for Payment Method Flow

export type CardType = 'visa' | 'mastercard' | 'amex';

export interface PaymentDetails {
  cardNumber: string;
  cardType: CardType;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
  cardholderName: string;
}

export interface BillingAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface PriceSummary {
  baseFare: number;
  seatFees: number;
  taxesAndFees: number;
  total: number;
}

export interface PaymentResult {
  success: boolean;
  error?: string;
  confirmationNumber?: string;
}
