# Quickstart: BE-003 Flight Search API

## Test the API

### 1. Direct Flight Search
```bash
curl "http://localhost:3000/api/flights/search?origin=JFK&destination=LAX&date=2025-03-15"
```

### 2. Search with Passengers & Class
```bash
curl "http://localhost:3000/api/flights/search?origin=JFK&destination=LAX&date=2025-03-15&passengers=2&class=business"
```

### 3. Sort by Duration
```bash
curl "http://localhost:3000/api/flights/search?origin=JFK&destination=LAX&date=2025-03-15&sortBy=duration&sortOrder=asc"
```

### 4. Sort by Stops (direct flights first)
```bash
curl "http://localhost:3000/api/flights/search?origin=JFK&destination=LAX&date=2025-03-15&sortBy=stops&sortOrder=asc"
```

## Expected Response

```json
{
  "results": [
    {
      "type": "direct",
      "pricePerPerson": 250,
      "totalDuration": 180,
      "stops": 0,
      "flights": [...]
    }
  ],
  "searchParams": {
    "origin": "JFK",
    "destination": "LAX",
    "date": "2025-03-15",
    "passengers": 1,
    "class": "economy"
  }
}
```

## Error Cases

### Invalid Airport Code
```bash
curl "http://localhost:3000/api/flights/search?origin=XX&destination=LAX&date=2025-03-15"
# Returns 400: "origin must be 3 letter airport code"
```

### Missing Required Param
```bash
curl "http://localhost:3000/api/flights/search?origin=JFK"
# Returns 400: "destination is required"
```
