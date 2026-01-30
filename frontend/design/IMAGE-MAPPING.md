# Image Mapping - Tripma Flight Booking

## Directory Structure

```
frontend/design/images/
├── auth/                   # Authentication
│   └── signup-modal.png    # Sign up modal design
│
├── booking-flow/           # Booking process
│   └── seats/
│       ├── economy-map.png       # Economy seat map (rows 6-24)
│       ├── business-map.png      # Business seat map (rows 1-5)
│       ├── economy-seat-icon.png # Single economy seat icon
│       └── business-seat-icon.png # Single business seat icon
│
├── confirmation/           # Booking confirmation page
│   ├── ryokan-japan.png         # Hotel card
│   ├── bessho-sasa.png          # Hotel card
│   ├── hotel-the-flag.png       # Hotel card
│   ├── 9-hours-shinjuku.png     # Hotel card
│   ├── nihon-kimono.png         # Experience card
│   └── teamlab-borderless.png   # Experience card
│
├── landing/                # Landing page
│   ├── shanghai.png        # Flight Deals - Left
│   ├── sydney.png          # Flight Deals - Center
│   ├── kyoto.png           # Flight Deals - Right
│   ├── kenya.png           # Featured destination
│   ├── maldives.png        # Places to Stay - Left
│   ├── morocco.png         # Places to Stay - Center
│   ├── mongolia.png        # Places to Stay - Right
│   ├── avatar-yifei.png    # Testimonial - Left
│   ├── avatar-kaori.png    # Testimonial - Center
│   └── avatar-anthony.png  # Testimonial - Right
│
└── search-results/         # Search results page
    ├── hotel-kaneyamaen.png  # Japan Hotels - Left
    ├── hotel-osaka.png       # Japan Hotels - Center
    ├── hotel-shinjuku.png    # Japan Hotels - Right
    ├── shanghai-night.png    # Also Searched - Left
    ├── nairobi.png           # Also Searched - Center
    └── seoul.png             # Also Searched - Right
```

---

## Image Count by Page

| Page | Count | Folder |
|------|-------|--------|
| Auth Modal | 1 | `auth/` |
| Landing Page | 10 | `landing/` |
| Search Results | 6 | `search-results/` |
| Seat Selection | 4 | `booking-flow/seats/` |
| Confirmation | 6 | `confirmation/` |
| **Total** | **27** | |

---

## Usage Reference

### Landing Page (SPEC-001C)
```typescript
// Flight Deals
{ src: 'assets/images/landing/shanghai.png', city: 'Shanghai', price: 598 }
{ src: 'assets/images/landing/sydney.png', city: 'Sydney', price: 981 }
{ src: 'assets/images/landing/kyoto.png', city: 'Kyoto', price: 633 }

// Featured
{ src: 'assets/images/landing/kenya.png', city: 'Nairobi', price: 1248 }

// Places to Stay
{ src: 'assets/images/landing/maldives.png', title: 'Maldives' }
{ src: 'assets/images/landing/morocco.png', title: 'Morocco' }
{ src: 'assets/images/landing/mongolia.png', title: 'Mongolia' }

// Testimonials
{ avatar: 'assets/images/landing/avatar-yifei.png', name: 'Yifei Chen' }
{ avatar: 'assets/images/landing/avatar-kaori.png', name: 'Kaori Yamazaki' }
{ avatar: 'assets/images/landing/avatar-anthony.png', name: 'Anthony Russo' }
```

### Search Results (SPEC-002B)
```typescript
// Hotels
{ src: 'assets/images/search-results/hotel-kaneyamaen.png', name: 'Hotel Kaneyamaen' }
{ src: 'assets/images/search-results/hotel-osaka.png', name: 'HOTEL THE FLAG' }
{ src: 'assets/images/search-results/hotel-shinjuku.png', name: '9 Hours Shinjuku' }

// Also Searched
{ src: 'assets/images/search-results/shanghai-night.png', city: 'Shanghai', price: 598 }
{ src: 'assets/images/search-results/nairobi.png', city: 'Nairobi', price: 1248 }
{ src: 'assets/images/search-results/seoul.png', city: 'Seoul', price: 589 }
```

### Seat Selection (SPEC-003B)
```typescript
// Seat class icons
{ src: 'assets/images/booking-flow/seats/economy-seat-icon.png', class: 'economy' }
{ src: 'assets/images/booking-flow/seats/business-seat-icon.png', class: 'business' }

// Seat maps (for reference)
{ src: 'assets/images/booking-flow/seats/economy-map.png' }
{ src: 'assets/images/booking-flow/seats/business-map.png' }
```

### Confirmation (SPEC-003D)
```typescript
// Hotels
{ src: 'assets/images/confirmation/ryokan-japan.png', name: 'Ryokan Japan', price: 439 }
{ src: 'assets/images/confirmation/bessho-sasa.png', name: 'Bessho SASA', price: 529 }
{ src: 'assets/images/confirmation/hotel-the-flag.png', name: 'HOTEL THE FLAG', price: 139 }
{ src: 'assets/images/confirmation/9-hours-shinjuku.png', name: '9 Hours Shinjuku', price: 59 }

// Experiences
{ src: 'assets/images/confirmation/nihon-kimono.png', name: 'Nihon Kimono', price: 89 }
{ src: 'assets/images/confirmation/teamlab-borderless.png', name: 'teamLab Borderless', price: 39 }
```

### Auth Modal (SPEC-004A)
```typescript
// Design reference
{ src: 'assets/images/auth/signup-modal.png' }
```
