# Data Model: Header & Footer Components

**Feature**: 001-header-footer
**Date**: 2025-01-30

## Entities

### 1. NavigationLink

Represents a navigation item in header or footer.

```typescript
interface NavigationLink {
  label: string;       // Display text
  route: string;       // Router path (e.g., '/flights')
  external?: boolean;  // If true, opens in new tab
}
```

**Validation Rules**:
- `label`: Required, non-empty string
- `route`: Required, must start with '/' for internal routes

### 2. FooterColumn

Represents a column in the footer.

```typescript
interface FooterColumn {
  title: string;              // Column header (e.g., 'About')
  links: NavigationLink[];    // Links in this column
}
```

### 3. User (from AuthService)

Minimal user representation for header display.

```typescript
interface User {
  id: string;
  displayName: string;    // Shown in header (e.g., "John")
  avatarUrl?: string;     // Optional profile image
}
```

### 4. AuthState

Auth state observable for header reactivity.

```typescript
interface AuthState {
  isLoggedIn: boolean;
  user: User | null;
}
```

## Static Data

### Header Navigation Links

```typescript
const HEADER_NAV_LINKS: NavigationLink[] = [
  { label: 'Flights', route: '/flights' },
  { label: 'Hotels', route: '/hotels' },
  { label: 'Packages', route: '/packages' }
];
```

### Footer Columns

```typescript
const FOOTER_COLUMNS: FooterColumn[] = [
  {
    title: 'About',
    links: [
      { label: 'About Tripma', route: '/about' },
      { label: 'How it works', route: '/how-it-works' },
      { label: 'Careers', route: '/careers' },
      { label: 'Press', route: '/press' },
      { label: 'Blog', route: '/blog' },
      { label: 'Forum', route: '/forum' }
    ]
  },
  {
    title: 'Partner with us',
    links: [
      { label: 'Partnership programs', route: '/partnership' },
      { label: 'Affiliate program', route: '/affiliate' },
      { label: 'Connectivity partners', route: '/connectivity' },
      { label: 'Promotions and events', route: '/promotions' },
      { label: 'Integrations', route: '/integrations' },
      { label: 'Community', route: '/community' },
      { label: 'Loyalty program', route: '/loyalty' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center', route: '/help' },
      { label: 'Contact us', route: '/contact' },
      { label: 'FAQ', route: '/faq' },
      { label: 'Accessibility', route: '/accessibility' }
    ]
  },
  {
    title: 'Get the app',
    links: [
      { label: 'Tripma for Android', route: '/android', external: true },
      { label: 'Tripma for iOS', route: '/ios', external: true }
    ]
  }
];
```

## State Transitions

### Mobile Menu State

```
CLOSED ──(tap hamburger)──> OPEN
OPEN ──(tap hamburger)──> CLOSED
OPEN ──(tap link)──> CLOSED
OPEN ──(click outside)──> CLOSED
```

### Auth State (Header Display)

```
LOGGED_OUT ──(login success)──> LOGGED_IN
  - Shows: Sign in | Sign up

LOGGED_IN ──(logout)──> LOGGED_OUT
  - Shows: My trips | 👤 {displayName}
```

## Relationships

```
Header
├── has many → NavigationLink (nav links)
├── observes → AuthState (from AuthService)
└── has one → MobileMenuState (open/closed)

Footer
├── has many → FooterColumn
└── FooterColumn has many → NavigationLink
```
