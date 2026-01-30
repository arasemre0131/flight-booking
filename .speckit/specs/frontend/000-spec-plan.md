# Frontend Spec Plan

## Overview
İki ana sayfa ve bunların ortak bileşenleri. Backend entegrasyonu ayrı spec'lerde.

---

## Sayfa Yapısı

### SPEC-001: Landing Page
Ana sayfa - arama formu ve içerik bölümleri

### SPEC-002: Search Results Page
Arama sonuçları - uçuş listesi, filtreler, harita

---

## Ortak Bileşenler (Her iki sayfada kullanılan)

| Bileşen | Kullanım | Dosya |
|---------|----------|-------|
| Header/Nav | Her iki sayfa | `shared/header/` |
| Footer | Her iki sayfa | `shared/footer/` |
| Search Form | Landing + Results (kompakt) | `shared/search-form/` |
| Airport Autocomplete | Search form içinde | `shared/airport-autocomplete/` |
| Date Picker | Search form içinde | `shared/date-picker/` |
| Passenger Selector | Search form içinde | `shared/passenger-selector/` |

---

## Dinamik Fonksiyonlar

### Search Form Bileşenleri
```
┌─────────────────────────────────────────────────────────────────┐
│  From where?  │  Where to?  │  Depart-Arrive  │ 1 Adult │Search│
└─────────────────────────────────────────────────────────────────┘
       ↓              ↓              ↓              ↓
   Autocomplete   Autocomplete   DatePicker    PassengerSelector
   (IATA codes)   (IATA codes)   (2 calendar)  (Adults/Minors)
```

| Fonksiyon | Davranış | Mock Data |
|-----------|----------|-----------|
| Airport Autocomplete | Yazınca filtreleme, IATA kodu göster | airports.json |
| Date Picker | 2 aylık takvim, range seçimi | - |
| Passenger Selector | +/- butonları, Adults + Minors | - |
| Round trip / One way | Radio toggle | - |

---

## Spec Bölümleri

### SPEC-001: Landing Page (~350 lines)

**Bölümler:**
1. Hero Section (search form dahil)
2. Flight Deals (3 kart)
3. Featured Destination (1 büyük kart)
4. Places to Stay (3 kart)
5. Testimonials (3 avatar + review)
6. Footer

**Dosyalar:**
```
src/app/
├── pages/
│   └── landing/
│       ├── landing.component.ts        (~80)
│       ├── landing.component.html      (~120)
│       └── landing.component.scss      (~100)
├── components/
│   ├── destination-card/               (~50)
│   ├── testimonial-card/               (~40)
│   └── featured-card/                  (~40)
└── shared/
    ├── header/                         (SPEC-001A)
    ├── footer/                         (SPEC-001A)
    ├── search-form/                    (SPEC-001B)
    ├── airport-autocomplete/           (SPEC-001B)
    ├── date-picker/                    (SPEC-001B)
    └── passenger-selector/             (SPEC-001B)
```

---

### SPEC-002: Search Results Page (~400 lines)

**Bölümler:**
1. Compact Search Bar (üstte)
2. Filter Bar (Max price, Shops, Times, Airlines, Seat class)
3. Flight List (airline logo, süre, saat, durak, fiyat)
4. Price Grid (flexible dates)
5. Price History Chart
6. Route Map (SVG)
7. Hotels Section (3 kart)
8. Also Searched (3 kart)

**Dosyalar:**
```
src/app/
├── pages/
│   └── search-results/
│       ├── search-results.component.ts    (~100)
│       ├── search-results.component.html  (~150)
│       └── search-results.component.scss  (~100)
├── components/
│   ├── flight-card/                       (~60)
│   ├── filter-bar/                        (~50)
│   ├── price-grid/                        (~40)
│   ├── price-chart/                       (~30)
│   ├── route-map/                         (~40)
│   └── hotel-card/                        (~40)
└── models/
    ├── flight.model.ts                    (~30)
    ├── airport.model.ts                   (~15)
    └── filter.model.ts                    (~20)
```

---

## Backend Entegrasyon Planı

### Phase 1: Mock Data (Şimdi)
```typescript
// mock-data/airports.ts
export const AIRPORTS = [
  { code: 'SFO', name: 'San Francisco International', city: 'San Francisco' },
  { code: 'NRT', name: 'Narita International', city: 'Tokyo' },
  // ...
];

// mock-data/flights.ts
export const MOCK_FLIGHTS = [
  {
    id: '1',
    airline: { code: 'HA', name: 'Hawaiian Airlines', logo: 'hawaiian.png' },
    departure: { time: '7:00 AM', airport: 'SFO' },
    arrival: { time: '4:15 PM', airport: 'NRT' },
    duration: '16h 45m',
    stops: 1,
    stopInfo: '2h 45m in HNL',
    price: 624
  }
];
```

### Phase 2: Backend API (Sonra)
| Endpoint | Kullanım | Spec |
|----------|----------|------|
| `GET /api/airports/search?q=` | Autocomplete | SPEC-101 |
| `GET /api/flights/search` | Flight search | SPEC-102 |
| `GET /api/flights/:id` | Flight details | SPEC-102 |

---

## Uygulama Sırası

```
1. SPEC-001A: Header + Footer (shared)
   └── ~100 lines

2. SPEC-001B: Search Form + Alt Bileşenler
   └── ~200 lines (autocomplete, datepicker, passenger)

3. SPEC-001C: Landing Page Content
   └── ~250 lines (hero, cards, testimonials)

4. SPEC-002A: Search Results - Flight List
   └── ~200 lines (flight cards, filters)

5. SPEC-002B: Search Results - Sidebar + Bottom
   └── ~200 lines (price grid, chart, map, hotels)
```

**Toplam: ~950 lines (5 spec, her biri <400 line)**

---

## Mock Data Dosyaları

```
src/app/
└── mock-data/
    ├── airports.ts      # IATA kodları + şehirler
    ├── flights.ts       # Örnek uçuş verileri
    ├── airlines.ts      # Havayolu bilgileri + logolar
    └── destinations.ts  # Landing page kartları
```
