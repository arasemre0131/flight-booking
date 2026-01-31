import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Flight, getStopsDisplay } from '../../models/flight.model';
import { PassengerCount } from '../../models/search-criteria.model';

@Component({
  selector: 'app-flight-summary',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './flight-summary.html',
  styleUrl: './flight-summary.scss'
})
export class FlightSummary {
  // Inputs
  selectedFlight = input.required<Flight>();
  returnFlight = input<Flight | null>(null);
  totalPrice = input.required<number>();
  passengers = input<PassengerCount>({ adults: 1, children: 0 });
  seatFees = input<number>(0);

  // Computed values
  isRoundTrip = computed(() => this.returnFlight() !== null);

  outboundStops = computed(() => getStopsDisplay(this.selectedFlight()));
  returnStops = computed(() => {
    const returnFl = this.returnFlight();
    return returnFl ? getStopsDisplay(returnFl) : '';
  });

  passengerCount = computed(() => {
    const p = this.passengers();
    return p.adults + p.children;
  });

  pricePerPerson = computed(() => {
    const count = this.passengerCount();
    const basePrice = this.totalPrice() - this.seatFees();
    return count > 0 ? basePrice / count : basePrice;
  });

  // Total including seat fees
  grandTotal = computed(() => this.totalPrice());

  // Format time for display (e.g., "7:00 AM")
  formatTime(time: string): string {
    return time;
  }

  // Format price
  formatPrice(price: number): string {
    return `$${price.toFixed(0)}`;
  }
}
