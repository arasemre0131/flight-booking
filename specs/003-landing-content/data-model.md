# Data Model: Landing Page Content

**Branch**: `003-landing-content` | **Date**: 2025-01-30

## Entities

### FlightDeal

Represents a flight deal destination card.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | `number` | Yes | Unique identifier |
| image | `string` | Yes | Path to destination image |
| landmark | `string` | Yes | Landmark/attraction name (e.g., "The Bund") |
| city | `string` | Yes | City name (e.g., "Shanghai") |
| price | `number` | Yes | Price in USD |
| tripType | `string` | Yes | Always "Round trip" |

### FeaturedDestination

Represents the full-width featured destination card.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| image | `string` | Yes | Path to destination image |
| city | `string` | Yes | City name (e.g., "Nairobi") |
| country | `string` | Yes | Country name (e.g., "Kenya") |
| description | `string` | Yes | Short description |
| price | `number` | Yes | Price in USD |

### PlaceToStay

Represents an accommodation destination card.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | `number` | Yes | Unique identifier |
| image | `string` | Yes | Path to destination image |
| title | `string` | Yes | Location name (e.g., "Maldives") |

### Testimonial

Represents a user testimonial/review card.

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | `number` | Yes | Unique identifier |
| avatar | `string` | Yes | Path to user avatar image |
| name | `string` | Yes | User's full name |
| location | `string` | Yes | User's location |
| rating | `number` | Yes | Star rating (1-5, always 5 in mock data) |
| review | `string` | Yes | Review text |

## TypeScript Interfaces

```typescript
// landing.model.ts

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
```

## Mock Data Structure

```typescript
// landing.data.ts

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
```

## Relationships

```
Landing Page
├── FlightDeal[] (3 items)
├── FeaturedDestination (1 item)
├── PlaceToStay[] (3 items)
└── Testimonial[] (3 items)
```

No database relationships - all static mock data.
