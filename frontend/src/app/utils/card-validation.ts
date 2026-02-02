// Card Validation Utilities

import { CardType } from '../models/payment.model';

/**
 * Validates card number using Luhn algorithm
 */
export function isValidLuhn(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let isEven = false;

  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }

  return sum % 10 === 0;
}

/**
 * Detects card type based on BIN prefix
 * Visa: starts with 4
 * Mastercard: starts with 51-55 or 2221-2720
 * Amex: starts with 34 or 37
 */
export function detectCardType(cardNumber: string): CardType | null {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 1) return null;

  if (/^4/.test(digits)) return 'visa';
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'mastercard';
  if (/^3[47]/.test(digits)) return 'amex';

  return null;
}

/**
 * Formats card number with spaces (XXXX XXXX XXXX XXXX)
 * Amex uses different format (XXXX XXXXXX XXXXX)
 */
export function formatCardNumber(value: string, cardType?: CardType | null): string {
  const digits = value.replace(/\D/g, '');
  const maxLength = cardType === 'amex' ? 15 : 16;
  const trimmed = digits.slice(0, maxLength);

  if (cardType === 'amex') {
    // Amex: 4-6-5 format
    return trimmed
      .replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, g1, g2, g3) => {
        let result = g1;
        if (g2) result += ' ' + g2;
        if (g3) result += ' ' + g3;
        return result;
      })
      .trim();
  }

  // Standard: 4-4-4-4 format
  return trimmed.replace(/(\d{4})(?=\d)/g, '$1 ').trim();
}

/**
 * Masks card number showing only last 4 digits
 */
export function maskCardNumber(cardNumber: string): string {
  const digits = cardNumber.replace(/\D/g, '');
  if (digits.length < 4) return cardNumber;
  const last4 = digits.slice(-4);
  return `•••• •••• •••• ${last4}`;
}

/**
 * Returns required CVV length based on card type
 * Amex: 4 digits, Others: 3 digits
 */
export function getCvvLength(cardType: CardType | null): number {
  return cardType === 'amex' ? 4 : 3;
}

/**
 * Validates expiry date is not in the past
 */
export function isValidExpiry(month: string, year: string): boolean {
  const expMonth = parseInt(month, 10);
  const expYear = parseInt(year, 10);

  if (isNaN(expMonth) || isNaN(expYear)) return false;
  if (expMonth < 1 || expMonth > 12) return false;

  const now = new Date();
  const currentYear = now.getFullYear() % 100; // Last 2 digits
  const currentMonth = now.getMonth() + 1;

  if (expYear < currentYear) return false;
  if (expYear === currentYear && expMonth < currentMonth) return false;

  return true;
}
