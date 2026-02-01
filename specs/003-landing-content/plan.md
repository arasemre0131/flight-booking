# Implementation Plan: Landing Page Content

**Branch**: `003-landing-content` | **Date**: 2025-01-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/003-landing-content/spec.md`

## Summary

Enhance the landing page with content sections below the hero: Flight Deals (3 destination cards), Featured Destination (full-width Kenya card), Places to Stay (3 accommodation cards), and Testimonials (3 review cards). All data is static mock data. Components follow Figma design with hover effects and responsive 3-column to single-column layout.

## Technical Context

**Language/Version**: TypeScript 5.x with Angular 17+
**Primary Dependencies**: Angular 17+ (standalone components), SCSS
**Storage**: N/A (static mock data, no persistence)
**Testing**: Jasmine + Karma (Angular default)
**Target Platform**: Web (Desktop + Mobile responsive)
**Project Type**: Web application (frontend component)
**Performance Goals**: Content loads within 3 seconds, images lazy-loaded
**Constraints**: Mobile-first responsive design, Figma design compliance
**Scale/Scope**: Landing page extension with 4 reusable card components

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Notes |
|-----------|--------|-------|
| I. Design-First Development | PASS | All content matches Figma design reference |
| II. Component-Based Architecture | PASS | Reusable card components (destination-card, testimonial-card) |
| III. Type Safety | PASS | TypeScript interfaces for all mock data entities |
| IV. Responsive Design | PASS | 3-column grid → single column on mobile (768px breakpoint) |
| V. Simplicity (YAGNI) | PASS | Static mock data, cards not clickable for MVP |

## Project Structure

### Documentation (this feature)

```text
specs/003-landing-content/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
frontend/
├── src/
│   ├── app/
│   │   ├── components/
│   │   │   ├── destination-card/
│   │   │   │   ├── destination-card.component.ts
│   │   │   │   ├── destination-card.component.html
│   │   │   │   └── destination-card.component.scss
│   │   │   └── testimonial-card/
│   │   │       ├── testimonial-card.component.ts
│   │   │       ├── testimonial-card.component.html
│   │   │       └── testimonial-card.component.scss
│   │   ├── models/
│   │   │   └── landing.model.ts
│   │   ├── mock-data/
│   │   │   └── landing.data.ts
│   │   └── pages/
│   │       └── landing/
│   │           ├── landing.component.ts (update)
│   │           ├── landing.component.html (update)
│   │           └── landing.component.scss (update)
│   └── assets/
│       └── images/
│           └── landing/ (10 images - already exist)
```

**Structure Decision**: Web application frontend structure. Reusable card components in `components/` directory. Mock data in dedicated `mock-data/` directory following Angular conventions.

## Complexity Tracking

No violations. Feature follows standard Angular component patterns with static mock data.

## Component Breakdown

| Component | Purpose | Inputs | Reusable |
|-----------|---------|--------|----------|
| `destination-card` | Display flight deal or place | `image`, `title`, `subtitle`, `price?`, `tripType?` | Yes |
| `testimonial-card` | Display user review | `avatar`, `name`, `location`, `rating`, `review` | Yes |
| `landing` (page) | Compose all sections | N/A | No |

## Section Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│                              HEADER                                   │
├─────────────────────────────────────────────────────────────────────┤
│  HERO (existing)                                                      │
│    - Title: "It's more than just a trip"                             │
│    - Search Form                                                      │
├─────────────────────────────────────────────────────────────────────┤
│  SECTION: Flight Deals (new)                                          │
│    - Title: "Find your next adventure with these flight deals"       │
│    - 3x destination-card (Shanghai, Sydney, Kyoto)                   │
├─────────────────────────────────────────────────────────────────────┤
│  SECTION: Featured Destination (new)                                  │
│    - Full-width card (Kenya)                                          │
├─────────────────────────────────────────────────────────────────────┤
│  SECTION: Places to Stay (new)                                        │
│    - Title: "Explore unique places to stay"                          │
│    - 3x destination-card (Maldives, Morocco, Mongolia)               │
├─────────────────────────────────────────────────────────────────────┤
│  SECTION: Testimonials (new)                                          │
│    - Title: "What SkyRoute users are saying"                           │
│    - 3x testimonial-card (Yifei, Kaori, Anthony)                     │
├─────────────────────────────────────────────────────────────────────┤
│                              FOOTER                                   │
└─────────────────────────────────────────────────────────────────────┘
```

## Styling Guidelines

**Brand Colors**:
- Primary: `#605DEC` (purple - for highlighted text)
- Text Dark: `#27273F`
- Text Gray: `#6E7491`
- Background Light: `#F6F6FE`
- White: `#FFFFFF`

**Section Title Pattern**:
```scss
.section-title {
  font-size: 32px;
  font-weight: 600;
  color: $text-dark;

  .highlight {
    color: $primary;
  }
}
```

**Card Grid Pattern**:
```scss
.card-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}
```

**Hover Effect**:
```scss
.card {
  transition: transform 0.2s ease, box-shadow 0.2s ease;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
}
```
