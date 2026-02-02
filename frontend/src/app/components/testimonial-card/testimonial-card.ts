import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-testimonial-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './testimonial-card.html',
  styleUrl: './testimonial-card.scss'
})
export class TestimonialCard {
  avatar = input.required<string>();
  name = input.required<string>();
  location = input.required<string>();
  rating = input.required<number>();
  review = input.required<string>();

  get stars(): number[] {
    return Array(this.rating()).fill(0);
  }
}
