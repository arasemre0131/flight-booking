import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface LegendItem {
  label: string;
  cssClass: string;
  price?: string;
}

@Component({
  selector: 'app-seat-legend',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './seat-legend.html',
  styleUrl: './seat-legend.scss'
})
export class SeatLegend {
  legendItems: LegendItem[] = [
    { label: 'Economy', cssClass: 'economy', price: 'Included' },
    { label: 'Business', cssClass: 'business', price: '+$100' },
    { label: 'Exit Row', cssClass: 'exit', price: '+$30' },
    { label: 'Occupied', cssClass: 'occupied' },
    { label: 'Selected', cssClass: 'selected' }
  ];

  // Seat images from Figma design
  businessSeatImage = 'assets/images/booking-flow/seats/business-seat-icon.png';
  economySeatImage = 'assets/images/booking-flow/seats/economy-seat-icon.png';
}
