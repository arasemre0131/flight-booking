import { Component, input, output, signal, computed } from '@angular/core';
import { Flight, getStopsDisplay } from '../../models/flight.model';

@Component({
  selector: 'app-flight-card',
  standalone: true,
  imports: [],
  templateUrl: './flight-card.html',
  styleUrl: './flight-card.scss'
})
export class FlightCard {
  // Inputs
  flight = input.required<Flight>();
  selected = input<boolean>(false);

  // Outputs
  select = output<string>();

  // State
  logoError = signal(false);

  // Computed
  stopsDisplay = computed(() => getStopsDisplay(this.flight()));

  onSelect(): void {
    this.select.emit(this.flight().id);
  }

  onLogoError(): void {
    this.logoError.set(true);
  }
}
