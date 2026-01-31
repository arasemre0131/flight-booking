import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BookingService } from '../../services/booking.service';
import { getStopsDisplay } from '../../models/flight.model';

@Component({
  selector: 'app-booking-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './booking-summary.html',
  styleUrl: './booking-summary.scss'
})
export class BookingSummary {
  private bookingService = inject(BookingService);
  private router = inject(Router);

  // Flight data
  selectedFlight = this.bookingService.selectedFlight;
  returnFlight = this.bookingService.returnFlight;

  // Passengers and seats
  passengers = this.bookingService.passengers;
  seatAssignments = this.bookingService.seatAssignments;

  // Price summary
  priceSummary = computed(() => this.bookingService.calculatePriceSummary());

  // Computed values
  isRoundTrip = computed(() => this.returnFlight() !== null);

  outboundStops = computed(() => {
    const flight = this.selectedFlight();
    return flight ? getStopsDisplay(flight) : '';
  });

  returnStops = computed(() => {
    const flight = this.returnFlight();
    return flight ? getStopsDisplay(flight) : '';
  });

  // Get seat assignment for a passenger
  getSeatForPassenger(passengerId: string): string {
    const assignment = this.seatAssignments().find(a => a.passengerId === passengerId);
    if (assignment?.seat) {
      return `${assignment.seat.row}${assignment.seat.letter}`;
    }
    return 'No seat selected';
  }

  // Navigate to edit passenger info
  editPassengers(): void {
    this.router.navigate(['/passenger-info']);
  }

  // Navigate to edit seats
  editSeats(): void {
    this.router.navigate(['/seat-selection']);
  }

  // Format price
  formatPrice(price: number): string {
    return `$${price.toFixed(0)}`;
  }

  // Format time
  formatTime(time: string): string {
    return time;
  }

  // Format duration
  formatDuration(duration: string): string {
    return duration;
  }
}
