# Image Mapping - Tripma Flight Booking

## Landing Page Images (`images/landing/`)

### Flight Deals Section (3 cards)
| Position | File | Description |
|----------|------|-------------|
| Left | `shanghai.png` | Shanghai skyline with Oriental Pearl Tower |
| Center | `sydney.png` | Sydney Opera House |
| Right | `kyoto.png` | Traditional Japanese architecture |

### Featured Destination (1 large card)
| Position | File | Description |
|----------|------|-------------|
| Full width | `kenya.png` | Kenya safari/wildlife scene |

### Places to Stay Section (3 cards)
| Position | File | Description |
|----------|------|-------------|
| Left | `maldives.png` | Maldives beach/resort |
| Center | `morocco.png` | Morocco architecture |
| Right | `mongolia.png` | Mongolia landscape |

### Testimonials Section (3 avatars)
| Position | File | Name |
|----------|------|------|
| Left | `avatar-yifei.png` | Yifei Chen |
| Center | `avatar-kaori.png` | Kaori Yamazaki |
| Right | `avatar-anthony.png` | Anthony Russo |

---

## Search Results Page Images (`images/search-results/`)

### Find Places to Stay in Japan (3 hotel cards)
| Position | File | Hotel Name |
|----------|------|------------|
| Left | `hotel-kaneyamaen.png` | Hotel Kaneyamaen and Bessho SASA |
| Center | `hotel-osaka.png` | HOTEL THE FLAG 大阪市 |
| Right | `hotel-shinjuku.png` | 9 Hours Shinjuku |

### People Also Searched For (3 destination cards)
| Position | File | Destination |
|----------|------|-------------|
| Left | `shanghai-night.png` | Shanghai, China ($598) |
| Center | `nairobi.png` | Nairobi, Kenya ($1,248) |
| Right | `seoul.png` | Seoul, South Korea ($589) |

---

## Usage in Angular Components

```typescript
// Landing page
const LANDING_IMAGES = {
  flightDeals: [
    { src: 'assets/images/landing/shanghai.png', city: 'Shanghai', country: 'China' },
    { src: 'assets/images/landing/sydney.png', city: 'Sydney', country: 'Australia' },
    { src: 'assets/images/landing/kyoto.png', city: 'Kyoto', country: 'Japan' }
  ],
  featured: {
    src: 'assets/images/landing/kenya.png', city: 'Nairobi', country: 'Kenya'
  },
  placesToStay: [
    { src: 'assets/images/landing/maldives.png', city: 'Maldives' },
    { src: 'assets/images/landing/morocco.png', city: 'Morocco' },
    { src: 'assets/images/landing/mongolia.png', city: 'Mongolia' }
  ],
  testimonials: [
    { avatar: 'assets/images/landing/avatar-yifei.png', name: 'Yifei Chen' },
    { avatar: 'assets/images/landing/avatar-kaori.png', name: 'Kaori Yamazaki' },
    { avatar: 'assets/images/landing/avatar-anthony.png', name: 'Anthony Russo' }
  ]
};

// Search results page
const SEARCH_IMAGES = {
  hotels: [
    { src: 'assets/images/search-results/hotel-kaneyamaen.png', name: 'Hotel Kaneyamaen' },
    { src: 'assets/images/search-results/hotel-osaka.png', name: 'HOTEL THE FLAG' },
    { src: 'assets/images/search-results/hotel-shinjuku.png', name: '9 Hours Shinjuku' }
  ],
  alsoSearched: [
    { src: 'assets/images/search-results/shanghai-night.png', city: 'Shanghai', price: 598 },
    { src: 'assets/images/search-results/nairobi.png', city: 'Nairobi', price: 1248 },
    { src: 'assets/images/search-results/seoul.png', city: 'Seoul', price: 589 }
  ]
};
```

## Note
- All images are PNG format with original quality preserved
- Images will be copied to `frontend/src/assets/images/` during Angular setup
