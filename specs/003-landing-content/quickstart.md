# Quickstart: Landing Page Content

**Branch**: `003-landing-content` | **Date**: 2025-01-30

## Prerequisites

- Node.js 18+ and npm
- Angular CLI 17+
- Features `001-header-footer` and `002-search-form` implemented

## Setup

```bash
# Navigate to frontend
cd frontend

# Install dependencies (if not already done)
npm install

# Start development server
ng serve
```

## Implementation Steps

### 1. Create Data Models

```bash
# Create landing models file
touch src/app/models/landing.model.ts
```

Add TypeScript interfaces from `data-model.md`.

### 2. Create Mock Data

```bash
# Create mock data directory and file
mkdir -p src/app/mock-data
touch src/app/mock-data/landing.data.ts
```

Add mock data arrays from `data-model.md`.

### 3. Generate Components

```bash
# Generate destination card component
ng generate component components/destination-card --standalone

# Generate testimonial card component
ng generate component components/testimonial-card --standalone
```

### 4. Implement Components

**destination-card.component.ts**:
- Inputs: `image`, `title`, `subtitle`, `price?`, `tripType?`
- Template: Image, title, subtitle, optional price display
- Styles: Card with hover effect, rounded corners

**testimonial-card.component.ts**:
- Inputs: `avatar`, `name`, `location`, `rating`, `review`
- Template: Review text, star rating, avatar with name/location
- Styles: Card with quote styling, avatar alignment

### 5. Update Landing Page

**landing.component.ts**:
- Import mock data arrays
- Import card components

**landing.component.html**:
- Add Flight Deals section with 3 destination-cards
- Add Featured Destination section (full-width)
- Add Places to Stay section with 3 destination-cards
- Add Testimonials section with 3 testimonial-cards

**landing.component.scss**:
- Section container styles
- Section title with highlighted text
- Card grid layouts (3-column, responsive)

## File Checklist

| File | Action | Lines (est.) |
|------|--------|--------------|
| `src/app/models/landing.model.ts` | Create | ~25 |
| `src/app/mock-data/landing.data.ts` | Create | ~60 |
| `src/app/components/destination-card/*.ts/html/scss` | Create | ~50 |
| `src/app/components/testimonial-card/*.ts/html/scss` | Create | ~60 |
| `src/app/pages/landing/landing.component.ts` | Update | +10 |
| `src/app/pages/landing/landing.component.html` | Update | +80 |
| `src/app/pages/landing/landing.component.scss` | Update | +100 |

**Total Estimated Lines**: ~385 (within 400 line limit)

## Verification

1. Navigate to `http://localhost:4200`
2. Verify hero section displays (existing)
3. Scroll down to see:
   - Flight Deals section with 3 cards
   - Featured Kenya destination (full-width)
   - Places to Stay section with 3 cards
   - Testimonials section with 3 cards
4. Test hover effects on cards
5. Resize browser to verify responsive layout

## Common Issues

**Images not loading**:
- Verify images exist in `src/assets/images/landing/`
- Check image paths in mock data start with `assets/` (no leading slash)

**Grid not responsive**:
- Ensure media query uses `768px` breakpoint
- Check grid-template-columns changes to `1fr` on mobile

**Styles not applying**:
- Verify SCSS variables are defined in component
- Check component selector in styles
