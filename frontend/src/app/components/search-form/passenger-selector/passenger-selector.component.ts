import { Component, input, output, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  PassengerCount,
  MAX_PASSENGERS,
  MIN_ADULTS,
  MAX_ADULTS,
  MIN_CHILDREN,
  MAX_CHILDREN,
  formatPassengers,
  getTotalPassengers
} from '../../../models/search-criteria.model';

@Component({
  selector: 'app-passenger-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './passenger-selector.component.html',
  styleUrl: './passenger-selector.component.scss'
})
export class PassengerSelectorComponent {
  value = input<PassengerCount>({ adults: 1, children: 0 });
  valueChange = output<PassengerCount>();

  isOpen = signal(false);

  displayValue = computed(() => formatPassengers(this.value()));
  totalPassengers = computed(() => getTotalPassengers(this.value()));

  canDecreaseAdults = computed(() => this.value().adults > MIN_ADULTS);
  canIncreaseAdults = computed(() =>
    this.value().adults < MAX_ADULTS &&
    this.totalPassengers() < MAX_PASSENGERS
  );

  canDecreaseChildren = computed(() => this.value().children > MIN_CHILDREN);
  canIncreaseChildren = computed(() =>
    this.value().children < MAX_CHILDREN &&
    this.totalPassengers() < MAX_PASSENGERS
  );

  toggle(): void {
    this.isOpen.update(open => !open);
  }

  close(): void {
    this.isOpen.set(false);
  }

  onBlur(): void {
    // Delay to allow click on buttons
    setTimeout(() => {
      this.close();
    }, 200);
  }

  decreaseAdults(): void {
    if (this.canDecreaseAdults()) {
      this.emit({ ...this.value(), adults: this.value().adults - 1 });
    }
  }

  increaseAdults(): void {
    if (this.canIncreaseAdults()) {
      this.emit({ ...this.value(), adults: this.value().adults + 1 });
    }
  }

  decreaseChildren(): void {
    if (this.canDecreaseChildren()) {
      this.emit({ ...this.value(), children: this.value().children - 1 });
    }
  }

  increaseChildren(): void {
    if (this.canIncreaseChildren()) {
      this.emit({ ...this.value(), children: this.value().children + 1 });
    }
  }

  private emit(value: PassengerCount): void {
    this.valueChange.emit(value);
  }
}
