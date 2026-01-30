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

## Booking Flow Images (`images/booking-flow/`)

### Seat Class Icons
| File | Description | Usage |
|------|-------------|-------|
| `economy-seats.png` | 4 blue economy seats | Seat selection - Economy option |
| `business-seats.png` | 4 teal/green business seats | Seat selection - Business option |

### Luggage Illustration
| File | Description | Usage |
|------|-------------|-------|
| `luggage.png` | Purple backpack + green suitcase | Passenger info - Bag section |

---

## Confirmation Page Images (`images/confirmation/`)

### Shop Hotels Section (3 cards)
| Position | File | Hotel Name | Price |
|----------|------|------------|-------|
| Top | `ryokan-japan.png` | Ryokan Japan | $439 |
| Middle | `bessho-sasa.png` | Bessho SASA | $529 |
| Bottom | `hotel-the-flag.png` | HOTEL THE FLAG 大阪市 | $139 |
| Bottom | `9-hours-shinjuku.png` | 9 Hours Shinjuku | $59 |

### Find Unique Experiences Section (2 cards)
| Position | File | Experience | Price |
|----------|------|------------|-------|
| Top | `nihon-kimono.png` | Nihon Kimono | $89 |
| Bottom | `teamlab-borderless.png` | teamLab Borderless | $39 |

---

## Icon Assets (SVG)

### Seat Map
- Available seat: Blue (#605DEC)
- Occupied seat: Light gray
- Selected seat: Purple with checkmark
- Exit row indicator

### Airline Logos
| Code | Airline | File |
|------|---------|------|
| HA | Hawaiian Airlines | `hawaiian.svg` |
| JL | Japan Airlines | `jal.svg` |
| DL | Delta | `delta.svg` |
| UA | United Airlines | `united.svg` |

---

## Usage in Angular Components

```typescript
// Confirmation page
const CONFIRMATION_IMAGES = {
  hotels: [
    { src: 'assets/images/confirmation/ryokan-japan.png', name: 'Ryokan Japan', price: 439 },
    { src: 'assets/images/confirmation/bessho-sasa.png', name: 'Bessho SASA', price: 529 },
    { src: 'assets/images/confirmation/hotel-the-flag.png', name: 'HOTEL THE FLAG', price: 139 },
    { src: 'assets/images/confirmation/9-hours-shinjuku.png', name: '9 Hours Shinjuku', price: 59 }
  ],
  experiences: [
    { src: 'assets/images/confirmation/nihon-kimono.png', name: 'Nihon Kimono', price: 89 },
    { src: 'assets/images/confirmation/teamlab-borderless.png', name: 'teamLab Borderless', price: 39 }
  ]
};
```
