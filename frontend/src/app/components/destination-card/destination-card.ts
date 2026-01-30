import { Component, input, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatedDestination } from '../../models/destination.model';

@Component({
  selector: 'app-destination-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './destination-card.html',
  styleUrl: './destination-card.scss'
})
export class DestinationCard {
  // Landing page style inputs
  image = input<string>('');
  title = input<string>('');
  subtitle = input<string>('');
  price = input<number | null>(null);
  tripType = input<string | null>(null);

  // Sidebar style input (RelatedDestination)
  destination = input<RelatedDestination | null>(null);

  // Computed mode based on which inputs are provided
  isCompactMode = computed(() => this.destination() !== null);

  // Computed values for template
  displayImage = computed(() => {
    const dest = this.destination();
    return dest ? dest.image : this.image();
  });

  displayCity = computed(() => {
    const dest = this.destination();
    return dest ? dest.city : this.title();
  });

  displayPrice = computed(() => {
    const dest = this.destination();
    return dest ? dest.flightPrice : this.price();
  });
}
