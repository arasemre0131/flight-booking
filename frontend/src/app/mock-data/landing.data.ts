import { FlightDeal, FeaturedDestination, PlaceToStay, Testimonial } from '../models/landing.model';

export const FLIGHT_DEALS: FlightDeal[] = [
  {
    id: 1,
    image: 'assets/images/landing/shanghai.png',
    landmark: 'The Bund',
    city: 'Shanghai',
    price: 598,
    tripType: 'Round trip'
  },
  {
    id: 2,
    image: 'assets/images/landing/sydney.png',
    landmark: 'Sydney Opera House',
    city: 'Sydney',
    price: 981,
    tripType: 'Round trip'
  },
  {
    id: 3,
    image: 'assets/images/landing/kyoto.png',
    landmark: 'Senso-ji Temple',
    city: 'Kyoto',
    price: 633,
    tripType: 'Round trip'
  }
];

export const FEATURED_DESTINATION: FeaturedDestination = {
  image: 'assets/images/landing/kenya.png',
  city: 'Nairobi',
  country: 'Kenya',
  description: 'Explore nature and wildlife in Africa',
  price: 1248
};

export const PLACES_TO_STAY: PlaceToStay[] = [
  { id: 1, image: 'assets/images/landing/maldives.png', title: 'Maldives' },
  { id: 2, image: 'assets/images/landing/morocco.png', title: 'Morocco' },
  { id: 3, image: 'assets/images/landing/mongolia.png', title: 'Mongolia' }
];

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    avatar: 'assets/images/landing/avatar-yifei.png',
    name: 'Yifei Chen',
    location: 'Seoul, South Korea',
    rating: 5,
    review: 'Tripma is awesome. I just booked my trip to Tokyo and the process was seamless. The app found me the best deals and I was able to book my flight in minutes.'
  },
  {
    id: 2,
    avatar: 'assets/images/landing/avatar-kaori.png',
    name: 'Kaori Yamazaki',
    location: 'Hokkaido, Japan',
    rating: 5,
    review: 'I always use Tripma when booking flights. The interface is clean and the prices are always competitive. Highly recommended!'
  },
  {
    id: 3,
    avatar: 'assets/images/landing/avatar-anthony.png',
    name: 'Anthony Russo',
    location: 'California, USA',
    rating: 5,
    review: 'Best travel app I have ever used. The customer support is fantastic and the flight options are endless.'
  }
];
