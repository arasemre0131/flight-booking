import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { PaymentService } from '../../services/payment.service';
import { PaymentForm } from '../../components/payment-form/payment-form';
import { BillingForm } from '../../components/billing-form/billing-form';
import { BookingSummary } from '../../components/booking-summary/booking-summary';
import { PaymentDetails, BillingAddress } from '../../models/payment.model';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [
    CommonModule,
    PaymentForm,
    BillingForm,
    BookingSummary
  ],
  templateUrl: './payment.html',
  styleUrl: './payment.scss'
})
export class PaymentPage {
  private bookingService = inject(BookingService);
  private paymentService = inject(PaymentService);
  private router = inject(Router);

  // Processing state
  isProcessing = signal(false);
  error = signal<string | null>(null);

  // Form validity tracking
  paymentFormValid = signal(false);
  billingFormValid = signal(false);

  // Check if both forms are valid
  isFormValid = computed(() => this.paymentFormValid() && this.billingFormValid());

  // Price summary
  priceSummary = computed(() => this.bookingService.calculatePriceSummary());

  // Check if booking exists
  hasBooking = computed(() => this.bookingService.bookingDraft() !== null);

  constructor() {
    // Redirect to home if no booking
    if (!this.bookingService.bookingDraft()) {
      this.router.navigate(['/']);
    }
  }

  // Handle payment form changes
  onPaymentDetailsChange(details: PaymentDetails | null): void {
    if (details) {
      this.bookingService.updatePaymentDetails(details);
    }
  }

  // Handle payment form validity changes
  onPaymentFormValidChange(isValid: boolean): void {
    this.paymentFormValid.set(isValid);
  }

  // Handle billing form changes
  onBillingAddressChange(address: BillingAddress | null): void {
    if (address) {
      this.bookingService.updateBillingAddress(address);
    }
  }

  // Handle billing form validity changes
  onBillingFormValidChange(isValid: boolean): void {
    this.billingFormValid.set(isValid);
  }

  // Navigate back to seat selection
  goBack(): void {
    this.router.navigate(['/seat-selection']);
  }

  // Process payment
  async onPayNow(): Promise<void> {
    if (!this.isFormValid() || this.isProcessing()) return;

    this.isProcessing.set(true);
    this.error.set(null);

    const paymentDetails = this.bookingService.paymentDetails();
    if (!paymentDetails) {
      this.error.set('Payment details are missing. Please fill in your card information.');
      this.isProcessing.set(false);
      return;
    }

    try {
      const result = await this.paymentService.processPayment(paymentDetails.cardNumber);

      if (result.success && result.confirmationNumber) {
        // Save confirmation number and navigate
        this.bookingService.setConfirmationNumber(result.confirmationNumber);
        this.router.navigate(['/confirmation']);
      } else {
        // Show error and allow retry
        this.error.set(result.error ?? 'Payment failed. Please try again.');
      }
    } catch (err) {
      this.error.set('An unexpected error occurred. Please try again.');
    } finally {
      this.isProcessing.set(false);
    }
  }

  // Format price for display
  formatPrice(price: number): string {
    return `$${price.toFixed(0)}`;
  }
}
