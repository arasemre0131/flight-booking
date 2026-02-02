import { Component, input } from '@angular/core';
import { Hotel } from '../../models/hotel.model';

@Component({
  selector: 'app-hotel-card',
  standalone: true,
  imports: [],
  templateUrl: './hotel-card.html',
  styleUrl: './hotel-card.scss',
})
export class HotelCard {
  hotel = input.required<Hotel>();
}
