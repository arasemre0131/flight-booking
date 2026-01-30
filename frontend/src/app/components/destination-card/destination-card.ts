import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-destination-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './destination-card.html',
  styleUrl: './destination-card.scss'
})
export class DestinationCard {
  image = input.required<string>();
  title = input.required<string>();
  subtitle = input.required<string>();
  price = input<number | null>(null);
  tripType = input<string | null>(null);
}
