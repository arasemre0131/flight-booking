# Quickstart: Header & Footer Components

**Feature**: 001-header-footer
**Date**: 2025-01-30

## Prerequisites

- Node.js 18+
- Angular CLI (via npx)
- Project cloned and dependencies installed

## Setup

```bash
cd frontend
npm install
```

## Development

### Start dev server

```bash
npm start
# or
ng serve
```

Visit `http://localhost:4200`

### Run tests

```bash
npm test
# or
ng test
```

## File Locations

| Component | Path |
|-----------|------|
| Header | `src/app/shared/header/header.component.*` |
| Footer | `src/app/shared/footer/footer.component.*` |
| Auth Service | `src/app/services/auth.service.ts` |
| Global Styles | `src/styles.scss` |

## Usage

### Import components in app

```typescript
// app.ts
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FooterComponent, RouterOutlet],
  template: `
    <app-header />
    <router-outlet />
    <app-footer />
  `
})
export class App {}
```

### Design Tokens (styles.scss)

```scss
// Colors
$primary: #605DEC;
$text-dark: #27273F;
$text-gray: #6E7491;
$bg-white: #FFFFFF;

// Breakpoints
$mobile: 768px;
```

## Verification Checklist

- [ ] Header displays logo linking to home
- [ ] Header shows Flights, Hotels, Packages links
- [ ] Header shows Sign in / Sign up (logged out)
- [ ] Header shows My trips / User name (logged in)
- [ ] Header sticks to top on scroll
- [ ] Mobile menu appears below 768px
- [ ] Footer shows 4 columns
- [ ] Footer stacks vertically on mobile
- [ ] All links have hover states
