# SPEC-002B: Search Results - Sidebar & Bottom

> **Status:** ⬜ Pending | **Lines:** ~200 | **Priority:** P0

## Overview
Sidebar components (price grid, price history, price rating) and bottom sections (route map, hotels, also searched).

## Dependencies
- **Requires:** SPEC-002A (Search Results - Flight List)
- **Required by:** None (Last frontend spec)

---

## Files to Create

| # | File Path | Purpose | Lines |
|---|-----------|---------|-------|
| 1 | `src/app/components/price-grid/price-grid.component.ts` | Price grid logic | ~30 |
| 2 | `src/app/components/price-grid/price-grid.component.html` | Price grid template | ~25 |
| 3 | `src/app/components/price-grid/price-grid.component.scss` | Price grid styles | ~20 |
| 4 | `src/app/components/price-chart/price-chart.component.ts` | Chart logic | ~25 |
| 5 | `src/app/components/price-chart/price-chart.component.html` | Chart template | ~15 |
| 6 | `src/app/components/price-chart/price-chart.component.scss` | Chart styles | ~15 |
| 7 | `src/app/components/route-map/route-map.component.ts` | Map logic | ~20 |
| 8 | `src/app/components/route-map/route-map.component.html` | Map SVG template | ~25 |
| 9 | `src/app/components/route-map/route-map.component.scss` | Map styles | ~15 |
| 10 | `src/app/components/hotel-card/hotel-card.component.ts` | Hotel card logic | ~15 |
| 11 | `src/app/components/hotel-card/hotel-card.component.html` | Hotel card template | ~15 |
| 12 | `src/app/components/hotel-card/hotel-card.component.scss` | Hotel card styles | ~15 |
| 13 | `src/app/mock-data/hotels.ts` | Hotel data | ~30 |
| 14 | `src/app/mock-data/prices.ts` | Price grid/history data | ~40 |

**Total: ~305 lines**

---

## Sidebar Layout

### Visual Reference (Right Column)
```
┌──────────────────────────────┐
│ Price grid (flexible dates)  │
│ ┌────┬────┬────┬────┬────┐  │
│ │    │2/12│2/13│2/14│2/15│  │
│ ├────┼────┼────┼────┼────┤  │
│ │ 3/7│$837│$592│$592│$1308│ │
│ │ 3/8│$837│$592│$592│$837│  │
│ │ 3/9│$624│$592│$624│$592│  │
│ └────┴────┴────┴────┴────┘  │
├──────────────────────────────┤
│ Price history                │
│ ┌──────────────────────────┐│
│ │     📈 (line chart)      ││
│ └──────────────────────────┘│
├──────────────────────────────┤
│ Price rating  [Buy soon]     │
│ We recommend booking soon.   │
│ Average cost: $750           │
│ Could rise 18% to $885       │
└──────────────────────────────┘
```

---

## Component 1: Price Grid

### Title
"Price grid **(flexible dates)**"

### Grid Layout
```
         2/12    2/13    2/14    2/15    2/16
  3/7    $837    $592    $592   $1,308   $837
  3/8    $837    $592    $592    $837   $1,308
  3/9    $624    $592    $624    $592    $592
  3/10  $1,308   $624    $624    $837    $837
  3/11   $592    $624   $1,308   $837    $624
```

### Cell Styles
- Lowest price: Green text
- Highest price: Red text
- Normal: Gray text
- Current selection: Purple background

### Mock Data (prices.ts)
```typescript
export const PRICE_GRID = {
  departureDates: ['2/12', '2/13', '2/14', '2/15', '2/16'],
  returnDates: ['3/7', '3/8', '3/9', '3/10', '3/11'],
  prices: [
    [837, 592, 592, 1308, 837],
    [837, 592, 592, 837, 1308],
    [624, 592, 624, 592, 592],
    [1308, 624, 624, 837, 837],
    [592, 624, 1308, 837, 624]
  ]
};
```

---

## Component 2: Price History Chart

### Title
"Price history"

### Chart
- Line chart showing price over time
- X-axis: dates
- Y-axis: price ($250 - $1000)
- Purple line with subtle fill below

### Mock Data
```typescript
export const PRICE_HISTORY = [
  { date: '1/1', price: 750 },
  { date: '1/8', price: 720 },
  { date: '1/15', price: 780 },
  { date: '1/22', price: 850 },
  { date: '1/29', price: 720 },
  { date: '2/5', price: 680 },
  { date: '2/12', price: 750 }
];
```

### Implementation
Use simple SVG path or CSS (no external chart library needed for MVP).

---

## Component 3: Price Rating

### Layout
```
┌──────────────────────────────────────┐
│ Price rating    [Buy soon]           │
│                  (green badge)       │
│                                      │
│ We recommend booking soon. The       │
│ average cost of this flight is $750, │
│ but could rise 18% to $885 in two    │
│ weeks.                               │
│                                      │
│ SkyRoute analyzes thousands of         │
│ flights, prices, and trends to       │
│ ensure you get the best deal.        │
└──────────────────────────────────────┘
```

### Badge
- Text: "Buy soon"
- Style: Green background (#0AA84A), white text, rounded

---

## Bottom Section: Route Map

### Layout
```
┌─────────────────────────────────────────────────────────────────┐
│                    [World Map SVG]                               │
│                                                                  │
│           NRT ●─────────✈─────────● SFO                        │
│                   (curved line)                                  │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

### Implementation
- Simple world map SVG (light purple fill)
- Two airport dots
- Curved dashed line connecting them
- Airplane icon on the line

### SVG Colors
- Map fill: `#E8E8FC` (light purple)
- Map stroke: `#605DEC` (purple)
- Route line: `#605DEC` dashed
- Airport dots: `#605DEC`

---

## Bottom Section: Hotels

### Title
"Find **places to stay** in Japan"     [All →]

### Cards (3)
| Image | Hotel Name | Description |
|-------|------------|-------------|
| `hotel-kaneyamaen.png` | Hotel Kaneyamaen and Bessho SASA | Located at the base of Mount Fuji... |
| `hotel-osaka.png` | HOTEL THE FLAG 大阪市 | Make a stop in Osaka and stay... |
| `hotel-shinjuku.png` | 9 Hours Shinjuku | Experience a truly unique stay... |

### Hotel Card Layout
```
┌─────────────────────────────┐
│        [Image]              │
├─────────────────────────────┤
│ Hotel Kaneyamaen and        │
│ Bessho SASA                 │
│                             │
│ Located at the base of      │
│ Mount Fuji, Hotel           │
│ Kaneyamaen is a traditional │
│ Japanese ryokan...          │
└─────────────────────────────┘
```

### Mock Data (hotels.ts)
```typescript
export interface Hotel {
  id: string;
  image: string;
  name: string;
  description: string;
}

export const JAPAN_HOTELS: Hotel[] = [
  {
    id: '1',
    image: 'assets/images/search-results/hotel-kaneyamaen.png',
    name: 'Hotel Kaneyamaen and Bessho SASA',
    description: 'Located at the base of Mount Fuji, Hotel Kaneyamaen is a traditional Japanese ryokan with a modern twist. Enjoy a private onsen bath and a private multi-course kaiseki dinner.'
  },
  {
    id: '2',
    image: 'assets/images/search-results/hotel-osaka.png',
    name: 'HOTEL THE FLAG 大阪市',
    description: 'Make a stop in Osaka and stay at HOTEL THE FLAG, just a few minutes walk to experience the food culture surrounding Dotonbori. Just one minute away in the Shinsaibashi shopping street.'
  },
  {
    id: '3',
    image: 'assets/images/search-results/hotel-shinjuku.png',
    name: '9 Hours Shinjuku',
    description: 'Experience a truly unique stay in an authentic Japanese capsule hotel. 9 Hours Shinjuku is minutes from one of Japan\'s busiest train stations. Just take the NEX train from Narita airport!'
  }
];
```

---

## Bottom Section: Also Searched

### Title
"People in **San Francisco** also searched for"     [All →]

### Cards (3)
| Image | City | Country | Price |
|-------|------|---------|-------|
| `shanghai-night.png` | Shanghai | China | $598 |
| `nairobi.png` | Nairobi | Kenya | $1,248 |
| `seoul.png` | Seoul | South Korea | $589 |

### Card Layout
```
┌─────────────────────────────┐
│        [Image]              │
├─────────────────────────────┤
│ Shanghai, China      $598   │
│ An international city rich  │
│ in culture                  │
└─────────────────────────────┘
```

### Mock Data
```typescript
export const ALSO_SEARCHED = [
  {
    image: 'assets/images/search-results/shanghai-night.png',
    city: 'Shanghai',
    country: 'China',
    price: 598,
    description: 'An international city rich in culture'
  },
  {
    image: 'assets/images/search-results/nairobi.png',
    city: 'Nairobi',
    country: 'Kenya',
    price: 1248,
    description: 'Dubbed the Safari Capital of the World'
  },
  {
    image: 'assets/images/search-results/seoul.png',
    city: 'Seoul',
    country: 'South Korea',
    price: 589,
    description: 'This modern city is a traveler\'s dream'
  }
];
```

---

## Acceptance Criteria

- [ ] Price grid displays 5x5 matrix
- [ ] Lowest price highlighted green
- [ ] Price history chart renders (SVG)
- [ ] "Buy soon" badge displays
- [ ] Route map shows NRT ↔ SFO
- [ ] 3 hotel cards display with images
- [ ] 3 "also searched" cards with prices
- [ ] "All →" links on section headers
- [ ] All images from `assets/images/search-results/`
- [ ] Responsive: sidebar below flights on mobile
