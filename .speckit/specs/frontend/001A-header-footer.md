# SPEC-001A: Header & Footer

> **Status:** ⬜ Pending | **Lines:** ~100 | **Priority:** P0

## Overview
Shared header navigation and footer components used across all pages.

## Dependencies
- **Requires:** None (First spec)
- **Required by:** SPEC-001B, SPEC-001C, SPEC-002A, SPEC-002B

---

## Files to Create

| # | File Path | Purpose | Lines |
|---|-----------|---------|-------|
| 1 | `src/app/shared/header/header.component.ts` | Header logic | ~15 |
| 2 | `src/app/shared/header/header.component.html` | Header template | ~20 |
| 3 | `src/app/shared/header/header.component.scss` | Header styles | ~25 |
| 4 | `src/app/shared/footer/footer.component.ts` | Footer logic | ~10 |
| 5 | `src/app/shared/footer/footer.component.html` | Footer template | ~25 |
| 6 | `src/app/shared/footer/footer.component.scss` | Footer styles | ~20 |

**Total: ~115 lines**

---

## Header Component

### Visual Reference
```
┌────────────────────────────────────────────────────────────────┐
│  SkyRoute          Flights  Hotels  Packages     Sign in  Sign up│
│  (purple)        (gray links)                  (gray)  (button)│
└────────────────────────────────────────────────────────────────┘
```

### Elements
| Element | Type | Style |
|---------|------|-------|
| Logo "SkyRoute" | Text | Purple (#605DEC), font-weight: 600 |
| Nav Links | Links | Gray (#6E7491), hover: purple |
| Sign in | Link | Gray (#6E7491) |
| Sign up | Button | Purple bg (#605DEC), white text, rounded |

### HTML Structure
```html
<header class="header">
  <a routerLink="/" class="logo">SkyRoute</a>

  <nav class="nav-links">
    <a routerLink="/flights">Flights</a>
    <a routerLink="/hotels">Hotels</a>
    <a routerLink="/packages">Packages</a>
  </nav>

  <div class="auth-buttons">
    <a routerLink="/login" class="sign-in">Sign in</a>
    <a routerLink="/register" class="sign-up-btn">Sign up</a>
  </div>
</header>
```

---

## Footer Component

### Visual Reference
```
┌────────────────────────────────────────────────────────────────┐
│  SkyRoute       About           Partner with us    Support       │
│               About SkyRoute    Partnership        Help Center   │
│               How it works    Affiliate          Contact us    │
│               Careers         ...                ...           │
│               Press                                            │
│               Blog            Get the app                      │
│               Forum           SkyRoute for Android               │
│                               SkyRoute for iOS                   │
└────────────────────────────────────────────────────────────────┘
```

### Footer Columns
| Column | Links |
|--------|-------|
| About | About SkyRoute, How it works, Careers, Press, Blog, Forum |
| Partner with us | Partnership programs, Affiliate program, Connectivity partners, Promotions and events, Integrations, Community, Loyalty program |
| Support | Help Center, Contact us, FAQ, Accessibility |
| Get the app | SkyRoute for Android, SkyRoute for iOS |

---

## Styles (Colors)

```scss
// Colors
$primary: #605DEC;
$text-dark: #27273F;
$text-gray: #6E7491;
$bg-white: #FFFFFF;

// Header
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 104px;
  background: $bg-white;
}

.logo {
  font-size: 20px;
  font-weight: 600;
  color: $primary;
  text-decoration: none;
}

.sign-up-btn {
  background: $primary;
  color: white;
  padding: 12px 20px;
  border-radius: 4px;
}
```

---

## Acceptance Criteria

- [ ] Header displays logo, nav links, and auth buttons
- [ ] Logo links to home page
- [ ] Nav links have hover state (purple)
- [ ] Sign up button has purple background
- [ ] Footer displays 4 columns with links
- [ ] Responsive: mobile menu (hamburger) for < 768px
- [ ] Standalone components (Angular 17+)
