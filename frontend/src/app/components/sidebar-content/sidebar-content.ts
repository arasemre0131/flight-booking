import { Component, input } from '@angular/core';
import { HotelCard } from '../hotel-card/hotel-card';
import { DestinationCard } from '../destination-card/destination-card';
import { Hotel } from '../../models/hotel.model';
import { RelatedDestination } from '../../models/destination.model';
import { MOCK_HOTELS } from '../../mock-data/hotels.data';
import { MOCK_DESTINATIONS } from '../../mock-data/destinations.data';

@Component({
  selector: 'app-sidebar-content',
  standalone: true,
  imports: [HotelCard, DestinationCard],
  templateUrl: './sidebar-content.html',
  styleUrl: './sidebar-content.scss',
})
export class SidebarContent {
  destinationCity = input<string>('your destination');

  hotels: Hotel[] = MOCK_HOTELS;
  destinations: RelatedDestination[] = MOCK_DESTINATIONS;
}
