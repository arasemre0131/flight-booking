import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SearchFormComponent } from '../../components/search-form/search-form.component';
import { DestinationCard } from '../../components/destination-card/destination-card';
import { TestimonialCard } from '../../components/testimonial-card/testimonial-card';
import {
  FLIGHT_DEALS,
  FEATURED_DESTINATION,
  PLACES_TO_STAY,
  TESTIMONIALS
} from '../../mock-data/landing.data';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, SearchFormComponent, DestinationCard, TestimonialCard],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.scss'
})
export class LandingComponent {
  flightDeals = FLIGHT_DEALS;
  featuredDestination = FEATURED_DESTINATION;
  placesToStay = PLACES_TO_STAY;
  testimonials = TESTIMONIALS;
}
