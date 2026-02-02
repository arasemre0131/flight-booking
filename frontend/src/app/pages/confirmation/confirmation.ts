import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { BookingService } from '../../services/booking.service';

@Component({
  selector: 'app-confirmation',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './confirmation.html',
  styleUrl: './confirmation.scss'
})
export class ConfirmationPage {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  // Computed signals
  confirmationNumber = computed(() => this.bookingService.confirmationNumber());
  booking = computed(() => this.bookingService.bookingDraft());
  priceSummary = computed(() => this.bookingService.calculatePriceSummary());
  seatAssignments = computed(() => this.bookingService.seatAssignments());

  // Check if booking exists
  hasBooking = computed(() => this.booking() !== null && this.confirmationNumber() !== null);

  constructor() {
    // Redirect if no confirmation number
    if (!this.bookingService.confirmationNumber()) {
      this.router.navigate(['/']);
    }
  }

  // Get passenger's seat for a specific flight
  getSeatForPassenger(passengerId: string, flightId: string): string {
    const assignments = this.seatAssignments();
    const assignment = assignments.find(
      a => a.passengerId === passengerId
    );
    return assignment?.seat?.id ?? 'Not assigned';
  }

  // Get card type icon
  getCardTypeIcon(): string {
    const payment = this.bookingService.paymentDetails();
    if (!payment) return '';

    switch (payment.cardType) {
      case 'visa': return 'Visa';
      case 'mastercard': return 'Mastercard';
      case 'amex': return 'Amex';
      default: return 'Card';
    }
  }

  // Mask card number for display
  getMaskedCard(): string {
    const payment = this.bookingService.paymentDetails();
    if (!payment) return '';
    return `•••• •••• •••• ${payment.cardNumber.slice(-4)}`;
  }

  // Get primary email from first passenger
  getPrimaryEmail(): string | null {
    const passengers = this.booking()?.passengers ?? [];
    return passengers[0]?.email ?? null;
  }

  // Format price for display
  formatPrice(price: number): string {
    return `$${price.toFixed(0)}`;
  }

  // Format date for display
  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }

  // Format time for display
  formatTime(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  }

  // Print confirmation
  printConfirmation(): void {
    window.print();
  }

  // Start new booking
  bookAnotherFlight(): void {
    this.bookingService.clearBooking();
    this.router.navigate(['/']);
  }
}
