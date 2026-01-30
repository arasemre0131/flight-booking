# Research: Search Results - Sidebar Content

**Branch**: `005-search-sidebar` | **Date**: 2025-01-31

## Research Tasks

### R1: Hotel Card Layout Pattern

**Question**: What is the best layout pattern for hotel cards with image, name, description, and price?

**Decision**: Vertical card with image on top, text content below

**Rationale**:
- Matches Figma design reference
- Standard e-commerce card pattern
- Image draws attention, text provides details
- Works well in vertical stack layout

**Alternatives Considered**:
- Horizontal card with image on left - rejected (doesn't fit sidebar width well)
- Grid layout - rejected (vertical stack specified in FR-011)

---

### R2: Destination Card Layout Pattern

**Question**: How should destination cards be arranged horizontally in a narrow sidebar?

**Decision**: Compact square cards with image background, city name overlay, price at bottom

**Rationale**:
- Matches Figma design for "People also search for" section
- Compact format fits 3 cards in a row within 350px sidebar
- Image-centric design emphasizes destinations visually

**Alternatives Considered**:
- Full-width stacked cards - rejected (doesn't match Figma, uses too much space)
- Text-only list - rejected (loses visual appeal)

---

### R3: Destination City Extraction

**Question**: How to get the destination city name for the "Find places to stay in [City]" header?

**Decision**: Use AirportService.getByCode() to look up arrival airport and extract city name

**Rationale**:
- Airport data already includes city names
- Search criteria provides destination airport code via URL params
- Existing service already used by search form

**Implementation**:
```typescript
// In sidebar-content component
const destinationCode = searchCriteria.destination?.code;
if (destinationCode) {
  airportService.getByCode(destinationCode).subscribe(airport => {
    this.destinationCity = airport?.city || 'your destination';
  });
}
```

**Alternatives Considered**:
- Hardcode "Japan" - rejected (not dynamic)
- Separate city lookup service - rejected (over-engineering, airport data has city)

---

### R4: Mock Data Structure

**Question**: What data structure should hotels and destinations mock data use?

**Decision**: Simple arrays matching the TypeScript interfaces

**Rationale**:
- Consistent with existing mock-data patterns (airlines.data.ts, flights.data.ts)
- Matches IMAGE-MAPPING.md file names
- Easy to extend later with backend integration

**Hotels Mock Data**:
```typescript
export const MOCK_HOTELS: Hotel[] = [
  { id: 'HTL001', name: 'Hotel Kaneyamaen', description: 'Traditional ryokan experience', image: 'assets/images/search-results/hotel-kaneyamaen.png', pricePerNight: 439 },
  { id: 'HTL002', name: 'HOTEL THE FLAG', description: 'Modern city hotel in Osaka', image: 'assets/images/search-results/hotel-osaka.png', pricePerNight: 139 },
  { id: 'HTL003', name: '9 Hours Shinjuku', description: 'Capsule hotel experience', image: 'assets/images/search-results/hotel-shinjuku.png', pricePerNight: 59 }
];
```

**Destinations Mock Data**:
```typescript
export const MOCK_DESTINATIONS: RelatedDestination[] = [
  { city: 'Shanghai', image: 'assets/images/search-results/shanghai-night.png', flightPrice: 598 },
  { city: 'Nairobi', image: 'assets/images/search-results/nairobi.png', flightPrice: 1248 },
  { city: 'Seoul', image: 'assets/images/search-results/seoul.png', flightPrice: 589 }
];
```

---

### R5: Component Organization

**Question**: Should sidebar content be one component or multiple?

**Decision**: Create a parent `sidebar-content` component that uses `hotel-card` and `destination-card` child components

**Rationale**:
- Follows component-based architecture principle
- hotel-card and destination-card are reusable
- Clean separation of concerns
- sidebar-content handles layout and data coordination

**Component Tree**:
```
sidebar-content (container)
├── hotel-card × 3 (vertical stack)
└── destination-card × 3 (horizontal row)
```

---

### R6: Hover Effect Implementation

**Question**: How to implement hover effects for interactivity feedback?

**Decision**: CSS-based hover with subtle transform and shadow transitions

**Rationale**:
- Pure CSS is performant
- Consistent with existing flight-card hover pattern from 004-search-results
- No JavaScript needed for simple visual feedback

**Implementation**:
```scss
.hotel-card, .destination-card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
}
```

---

## Summary

| Topic | Decision |
|-------|----------|
| Hotel card layout | Vertical with image on top |
| Destination card layout | Compact square with image background |
| City extraction | AirportService.getByCode() |
| Mock data | Simple arrays matching interfaces |
| Component organization | Parent container + child card components |
| Hover effects | CSS transitions |

All research complete. No NEEDS CLARIFICATION items remain.
