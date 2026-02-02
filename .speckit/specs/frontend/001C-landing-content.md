# SPEC-001C: Landing Page Content

> **Status:** ⬜ Pending | **Lines:** ~250 | **Priority:** P0

## Overview
Landing page with hero section, flight deals, featured destination, places to stay, and testimonials.

## Dependencies
- **Requires:** SPEC-001A (Header/Footer), SPEC-001B (Search Form)
- **Required by:** SPEC-002A

---

## Files to Create

| # | File Path | Purpose | Lines |
|---|-----------|---------|-------|
| 1 | `src/app/pages/landing/landing.component.ts` | Page logic | ~30 |
| 2 | `src/app/pages/landing/landing.component.html` | Page template | ~80 |
| 3 | `src/app/pages/landing/landing.component.scss` | Page styles | ~60 |
| 4 | `src/app/components/destination-card/destination-card.component.ts` | Card logic | ~15 |
| 5 | `src/app/components/destination-card/destination-card.component.html` | Card template | ~15 |
| 6 | `src/app/components/destination-card/destination-card.component.scss` | Card styles | ~20 |
| 7 | `src/app/components/testimonial-card/testimonial-card.component.ts` | Testimonial logic | ~15 |
| 8 | `src/app/components/testimonial-card/testimonial-card.component.html` | Testimonial template | ~15 |
| 9 | `src/app/components/testimonial-card/testimonial-card.component.scss` | Testimonial styles | ~20 |
| 10 | `src/app/mock-data/destinations.ts` | Landing page data | ~50 |

**Total: ~320 lines**

---

## Page Sections

### Visual Layout
```
┌────────────────────────────────────────────────────────────────┐
│                         HEADER                                  │
├────────────────────────────────────────────────────────────────┤
│                                                                 │
│           It's more than just a trip                           │
│                    (Hero Text)                                  │
│                                                                 │
│        [=============== SEARCH FORM ===============]            │
│                                                                 │
├────────────────────────────────────────────────────────────────┤
│  Find your next adventure with these flight deals              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │ Shanghai │  │  Sydney  │  │  Kyoto   │                     │
│  │  $598    │  │  $981    │  │  $633    │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
├────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │                    KENYA (Featured)                     │   │
│  │               Explore nature - $1,248                   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
├────────────────────────────────────────────────────────────────┤
│  Explore unique places to stay                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │ Maldives │  │ Morocco  │  │ Mongolia │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
├────────────────────────────────────────────────────────────────┤
│  What SkyRoute users are saying                                  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                     │
│  │  Yifei   │  │  Kaori   │  │ Anthony  │                     │
│  │ ⭐⭐⭐⭐⭐│  │ ⭐⭐⭐⭐⭐│  │ ⭐⭐⭐⭐⭐│                     │
│  │ "Review" │  │ "Review" │  │ "Review" │                     │
│  └──────────┘  └──────────┘  └──────────┘                     │
├────────────────────────────────────────────────────────────────┤
│                         FOOTER                                  │
└────────────────────────────────────────────────────────────────┘
```

---

## Section 1: Hero

### Elements
| Element | Content | Style |
|---------|---------|-------|
| Background | World map (light gray, subtle) | `opacity: 0.1` |
| Headline | "It's more than just a trip" | Purple gradient, italic, 80px |
| Search Form | Full mode | Centered, shadow |

### Headline Style
```scss
.hero-headline {
  font-size: 80px;
  font-style: italic;
  font-weight: 700;
  background: linear-gradient(to right, #605DEC, #9E9CF3);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
```

---

## Section 2: Flight Deals

### Title
"Find your next adventure with these **flight deals**"
- "flight deals" = purple color

### Cards (3)
| Position | Image | City | Country | Price |
|----------|-------|------|---------|-------|
| Left | `shanghai.png` | The Bund | Shanghai | $598 |
| Center | `sydney.png` | Sydney Opera House | Sydney | $981 |
| Right | `kyoto.png` | Senso-ji Temple | Kyoto | $633 |

### Card Layout
```
┌─────────────────────┐
│     [Image]         │
│                     │
├─────────────────────┤
│ The Bund, Shanghai  │
│ $598 · Round trip   │
└─────────────────────┘
```

---

## Section 3: Featured Destination

### Full-width Card
| Image | Title | Description | Price |
|-------|-------|-------------|-------|
| `kenya.png` | Nairobi, Kenya | Explore nature | $1,248 |

### Layout
```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│                      [Large Image]                          │
│                                                             │
│    Nairobi, Kenya                                          │
│    Explore nature and wildlife in Africa                    │
│    $1,248 · Round trip                                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Section 4: Places to Stay

### Title
"Explore unique **places to stay**"

### Cards (3)
| Position | Image | Location | Description |
|----------|-------|----------|-------------|
| Left | `maldives.png` | Maldives | Overwater bungalows |
| Center | `morocco.png` | Morocco | Desert adventures |
| Right | `mongolia.png` | Mongolia | Nomadic experiences |

---

## Section 5: Testimonials

### Title
"What **SkyRoute users** are saying"

### Cards (3)
| Avatar | Name | Location | Rating | Review |
|--------|------|----------|--------|--------|
| `avatar-yifei.png` | Yifei Chen | Seoul, South Korea | 5 stars | "SkyRoute is awesome..." |
| `avatar-kaori.png` | Kaori Yamazaki | Hokkaido, Japan | 5 stars | "I always use SkyRoute..." |
| `avatar-anthony.png` | Anthony Russo | California, USA | 5 stars | "Best travel app..." |

### Testimonial Card Layout
```
┌─────────────────────────────────┐
│ "SkyRoute is awesome. I just     │
│ booked my trip to Tokyo and    │
│ the process was seamless."     │
│                                 │
│ ⭐⭐⭐⭐⭐                        │
│                                 │
│ ┌────┐                         │
│ │ 🧑 │ Yifei Chen              │
│ └────┘ Seoul, South Korea      │
└─────────────────────────────────┘
```

---

## Mock Data (destinations.ts)

```typescript
export const FLIGHT_DEALS = [
  {
    id: 1,
    image: 'assets/images/landing/shanghai.png',
    title: 'The Bund',
    city: 'Shanghai',
    price: 598,
    tripType: 'Round trip'
  },
  {
    id: 2,
    image: 'assets/images/landing/sydney.png',
    title: 'Sydney Opera House',
    city: 'Sydney',
    price: 981,
    tripType: 'Round trip'
  },
  {
    id: 3,
    image: 'assets/images/landing/kyoto.png',
    title: 'Senso-ji Temple',
    city: 'Kyoto',
    price: 633,
    tripType: 'Round trip'
  }
];

export const FEATURED_DESTINATION = {
  image: 'assets/images/landing/kenya.png',
  city: 'Nairobi',
  country: 'Kenya',
  description: 'Explore nature and wildlife in Africa',
  price: 1248
};

export const PLACES_TO_STAY = [
  { image: 'assets/images/landing/maldives.png', title: 'Maldives' },
  { image: 'assets/images/landing/morocco.png', title: 'Morocco' },
  { image: 'assets/images/landing/mongolia.png', title: 'Mongolia' }
];

export const TESTIMONIALS = [
  {
    avatar: 'assets/images/landing/avatar-yifei.png',
    name: 'Yifei Chen',
    location: 'Seoul, South Korea',
    rating: 5,
    review: 'SkyRoute is awesome. I just booked my trip to Tokyo and the process was seamless. The app found me the best deals and I was able to book my flight in minutes.'
  },
  {
    avatar: 'assets/images/landing/avatar-kaori.png',
    name: 'Kaori Yamazaki',
    location: 'Hokkaido, Japan',
    rating: 5,
    review: 'I always use SkyRoute when booking flights. The interface is clean and the prices are always competitive. Highly recommended!'
  },
  {
    avatar: 'assets/images/landing/avatar-anthony.png',
    name: 'Anthony Russo',
    location: 'California, USA',
    rating: 5,
    review: 'Best travel app I have ever used. The customer support is fantastic and the flight options are endless.'
  }
];
```

---

## Acceptance Criteria

- [ ] Hero section with headline and search form
- [ ] Flight deals section with 3 cards
- [ ] Featured destination (full-width card)
- [ ] Places to stay section with 3 cards
- [ ] Testimonials section with 3 review cards
- [ ] All images load from `assets/images/landing/`
- [ ] Purple highlights on section titles
- [ ] Star ratings display correctly
- [ ] Cards have hover effects
- [ ] Responsive layout (grid → stack on mobile)
