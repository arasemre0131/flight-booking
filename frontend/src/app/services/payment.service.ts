import { Injectable } from '@angular/core';
import { PaymentResult } from '../models/payment.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  // Test card that always fails
  private readonly FAILURE_CARD = '4000000000000002';

  // Processing delay for realistic UX
  private readonly PROCESSING_DELAY = 1500;

  /**
   * Process payment (mock implementation)
   * - Always succeeds after delay except for test failure card
   * - Test card 4000000000000002 always fails
   */
  async processPayment(cardNumber: string): Promise<PaymentResult> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, this.PROCESSING_DELAY));

    const digits = cardNumber.replace(/\D/g, '');

    // Check for test failure card
    if (digits === this.FAILURE_CARD) {
      return {
        success: false,
        error: 'Card declined. Please try another card.'
      };
    }

    // All other valid cards succeed
    return {
      success: true,
      confirmationNumber: this.generateConfirmationNumber()
    };
  }

  /**
   * Generate a unique confirmation number
   * Format: TRP-YYYY-XXXXXX
   */
  private generateConfirmationNumber(): string {
    const year = new Date().getFullYear();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TRP-${year}-${random}`;
  }
}
