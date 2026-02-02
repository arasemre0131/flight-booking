export interface FlightDeal {
  id: number;
  image: string;
  landmark: string;
  city: string;
  price: number;
  tripType: 'Round trip';
}

export interface FeaturedDestination {
  image: string;
  city: string;
  country: string;
  description: string;
  price: number;
}

export interface PlaceToStay {
  id: number;
  image: string;
  title: string;
}

export interface Testimonial {
  id: number;
  avatar: string;
  name: string;
  location: string;
  rating: number;
  review: string;
}
