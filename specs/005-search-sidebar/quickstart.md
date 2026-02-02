# Quickstart: Search Results - Sidebar Content

**Branch**: `005-search-sidebar` | **Date**: 2025-01-31

## Prerequisites

- [x] 004-search-results implemented (search results page with sidebar placeholder)
- [x] Images exist in `frontend/design/images/search-results/`

## Implementation Steps

### Step 1: Create Data Models

```bash
# Create model files
touch frontend/src/app/models/hotel.model.ts
touch frontend/src/app/models/destination.model.ts
```

### Step 2: Create Mock Data

```bash
# Create mock data files
touch frontend/src/app/mock-data/hotels.data.ts
touch frontend/src/app/mock-data/destinations.data.ts
```

### Step 3: Generate Components

```bash
cd frontend

# Hotel card component
npx ng generate component components/hotel-card --standalone

# Destination card component
npx ng generate component components/destination-card --standalone

# Sidebar content container
npx ng generate component components/sidebar-content --standalone
```

### Step 4: Implement Components

1. **hotel-card**: Display hotel image, name, description, price
2. **destination-card**: Display destination image with city/price overlay
3. **sidebar-content**: Container with hotels section and destinations section

### Step 5: Integrate with Search Results

Update `search-results.component.ts`:
- Import `SidebarContentComponent`
- Extract destination city from search criteria
- Pass destination city to sidebar-content

Update `search-results.component.html`:
- Replace sidebar placeholder with `<app-sidebar-content>`

## File Checklist

| File | Status | Description |
|------|--------|-------------|
| `models/hotel.model.ts` | ⬜ | Hotel interface |
| `models/destination.model.ts` | ⬜ | RelatedDestination interface |
| `mock-data/hotels.data.ts` | ⬜ | 3 hotel mock items |
| `mock-data/destinations.data.ts` | ⬜ | 3 destination mock items |
| `components/hotel-card/hotel-card.component.ts` | ⬜ | Hotel card logic |
| `components/hotel-card/hotel-card.component.html` | ⬜ | Hotel card template |
| `components/hotel-card/hotel-card.component.scss` | ⬜ | Hotel card styles |
| `components/destination-card/destination-card.component.ts` | ⬜ | Destination card logic |
| `components/destination-card/destination-card.component.html` | ⬜ | Destination card template |
| `components/destination-card/destination-card.component.scss` | ⬜ | Destination card styles |
| `components/sidebar-content/sidebar-content.component.ts` | ⬜ | Sidebar container logic |
| `components/sidebar-content/sidebar-content.component.html` | ⬜ | Sidebar container template |
| `components/sidebar-content/sidebar-content.component.scss` | ⬜ | Sidebar container styles |
| `pages/search-results/search-results.html` | ⬜ | Update sidebar |
| `pages/search-results/search-results.ts` | ⬜ | Add imports |

## Verification

After implementation:

```bash
cd frontend
npx ng build
npx ng serve
```

Then navigate to: `http://localhost:4200/search?origin=SFO&destination=NRT&departureDate=2025-03-15&adults=1`

Verify:
- [ ] "Find places to stay in Tokyo" header displays
- [ ] 3 hotel cards display vertically with images, names, descriptions, prices
- [ ] "People also search for" header displays
- [ ] 3 destination cards display horizontally with images, cities, prices
- [ ] Hover effects work on all cards
- [ ] At 768px breakpoint, sidebar moves below flight list
- [ ] No console errors

## Key Points

1. **Use absolute image paths**: `assets/images/search-results/...`
2. **Use existing SCSS variables**: $primary, $text-dark, $text-gray, $bg-light
3. **Match existing patterns**: See flight-card for hover effect reference
4. **Keep it simple**: Display-only cards, no click navigation
