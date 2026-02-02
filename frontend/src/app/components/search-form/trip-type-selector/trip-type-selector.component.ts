import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripType } from '../../../models/search-criteria.model';

@Component({
  selector: 'app-trip-type-selector',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './trip-type-selector.component.html',
  styleUrl: './trip-type-selector.component.scss'
})
export class TripTypeSelectorComponent {
  value = input<TripType>('round-trip');
  valueChange = output<TripType>();

  select(type: TripType): void {
    this.valueChange.emit(type);
  }
}
