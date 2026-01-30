# Feature Specification: Header & Footer Components

**Feature Branch**: `001-header-footer`
**Created**: 2025-01-30
**Status**: Draft
**Input**: User description: "Shared header navigation and footer components for Tripma flight booking application"

## Clarifications

### Session 2025-01-30

- Q: What should the header display after a user logs in? → A: Show "My trips" link + User avatar/name (e.g., "👤 John")
- Q: Should the header stick to the top when user scrolls? → A: Yes, header sticks to top on scroll (sticky/fixed position)
- Q: How should footer columns display on mobile (< 768px)? → A: Stack all 4 columns vertically (single column layout)

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navigate to Main Sections (Priority: P1)

As a visitor, I want to see a clear navigation header so I can easily access different sections of the website (Flights, Hotels, Packages).

**Why this priority**: Navigation is the primary way users explore the application. Without it, users cannot access any functionality.

**Independent Test**: Can be fully tested by loading any page and verifying the header displays with working navigation links.

**Acceptance Scenarios**:

1. **Given** I am on any page, **When** the page loads, **Then** I see the Tripma logo and navigation links (Flights, Hotels, Packages)
2. **Given** I am viewing the header, **When** I click on "Flights", **Then** I am navigated to the flights page
3. **Given** I am viewing the header, **When** I hover over a navigation link, **Then** the link color changes to purple (#605DEC)

---

### User Story 2 - Access Authentication (Priority: P1)

As a visitor, I want to see Sign in and Sign up options so I can create an account or log into my existing account.

**Why this priority**: Authentication is required for booking flights. Users need clear access to login/register functionality.

**Independent Test**: Can be tested by verifying Sign in/Sign up buttons are visible and clickable.

**Acceptance Scenarios**:

1. **Given** I am not logged in, **When** I view the header, **Then** I see "Sign in" link and "Sign up" button
2. **Given** I am viewing the header, **When** I click "Sign up", **Then** the sign up modal/page opens
3. **Given** I am viewing the header, **When** I click "Sign in", **Then** the sign in modal/page opens

---

### User Story 3 - Access Footer Information (Priority: P2)

As a visitor, I want to see a footer with useful links so I can find information about the company, support, and mobile apps.

**Why this priority**: Footer provides secondary navigation and company information. Important but not blocking core functionality.

**Independent Test**: Can be tested by scrolling to bottom of any page and verifying footer sections are present.

**Acceptance Scenarios**:

1. **Given** I am on any page, **When** I scroll to the bottom, **Then** I see the footer with Tripma branding
2. **Given** I am viewing the footer, **When** I look at the content, **Then** I see 4 columns: About, Partner with us, Support, Get the app
3. **Given** I am viewing the footer, **When** I click any footer link, **Then** I am taken to the appropriate page

---

### User Story 4 - Mobile Navigation (Priority: P3)

As a mobile user, I want the navigation to adapt to my screen size so I can easily navigate on smaller devices.

**Why this priority**: Mobile responsiveness is important for accessibility but desktop is primary target initially.

**Independent Test**: Can be tested by resizing browser to mobile width and verifying hamburger menu appears.

**Acceptance Scenarios**:

1. **Given** I am on a screen smaller than 768px, **When** the page loads, **Then** I see a hamburger menu icon instead of expanded navigation
2. **Given** I see the hamburger menu, **When** I tap it, **Then** a mobile menu opens with all navigation options

---

### Edge Cases

- What happens when the logo image fails to load? Display text "Tripma" as fallback
- How does system handle very long navigation text? Truncate or use responsive breakpoints
- What happens on extremely wide screens? Max-width container to maintain readability

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: System MUST display the Tripma logo that links to the home page
- **FR-002**: System MUST display navigation links for Flights, Hotels, and Packages sections
- **FR-003**: System MUST display Sign in link and Sign up button for unauthenticated users
- **FR-009**: System MUST display "My trips" link and user avatar with name (e.g., "👤 John") for authenticated users
- **FR-010**: Header MUST remain fixed/sticky at the top of viewport when user scrolls
- **FR-011**: Footer MUST stack all 4 columns vertically on mobile screens (< 768px)
- **FR-004**: System MUST display footer with 4 columns of links (About, Partner with us, Support, Get the app)
- **FR-005**: Navigation links MUST have hover state with purple (#605DEC) color
- **FR-006**: Sign up button MUST have purple background (#605DEC) with white text
- **FR-007**: Header and Footer MUST be consistent across all pages
- **FR-008**: System MUST provide responsive mobile menu for screens < 768px

### Key Entities

- **Header**: Top navigation bar containing logo, nav links, and auth buttons
- **Footer**: Bottom section containing company links organized in 4 columns
- **Navigation Link**: Clickable text that routes to different sections

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Users can identify and click any navigation link within 2 seconds of page load
- **SC-002**: Header and Footer display correctly on 100% of pages
- **SC-003**: Navigation hover states respond within 100ms
- **SC-004**: Mobile menu toggle works on all screens below 768px width
- **SC-005**: All footer links are accessible and clickable

## Visual Reference

### Header Layout
```
┌────────────────────────────────────────────────────────────────┐
│  Tripma          Flights  Hotels  Packages     Sign in  Sign up│
│  (purple)        (gray links)                  (gray)  (button)│
└────────────────────────────────────────────────────────────────┘
```

### Footer Layout
```
┌────────────────────────────────────────────────────────────────┐
│  Tripma       About           Partner with us    Support       │
│               About Tripma    Partnership        Help Center   │
│               How it works    Affiliate          Contact us    │
│               Careers         ...                ...           │
│               Press                                            │
│               Blog            Get the app                      │
│               Forum           Tripma for Android               │
│                               Tripma for iOS                   │
└────────────────────────────────────────────────────────────────┘
```

### Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary Color | #605DEC | Logo, hover states, Sign up button |
| Text Dark | #27273F | Main text |
| Text Gray | #6E7491 | Navigation links, Sign in |
| Background | #FFFFFF | Header/Footer background |

### Footer Columns Content

| Column | Links |
|--------|-------|
| About | About Tripma, How it works, Careers, Press, Blog, Forum |
| Partner with us | Partnership programs, Affiliate program, Connectivity partners, Promotions and events, Integrations, Community, Loyalty program |
| Support | Help Center, Contact us, FAQ, Accessibility |
| Get the app | Tripma for Android, Tripma for iOS |
