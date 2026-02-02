# Quickstart: BE-004 Booking & Seats API

## Test Flow

### 1. Login as Passenger
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
# Save the token
```

### 2. Get Available Seats
```bash
curl http://localhost:3000/api/flights/{flightId}/seats \
  -H "Authorization: Bearer {token}"
```

### 3. Create Booking
```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "flightId": "...",
    "passengers": [{
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "phone": "+1234567890",
      "dateOfBirth": "1990-01-15",
      "passportNumber": "AB123456"
    }],
    "class": "economy",
    "extras": { "additionalBaggage": 1, "extraLegroom": false }
  }'
# Save bookingId
```

### 4. Select Seats
```bash
curl -X POST http://localhost:3000/api/bookings/{bookingId}/seats \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "seatAssignments": [
      { "passengerIndex": 0, "seatNumber": "12A" }
    ]
  }'
```

### 5. Confirm Booking (Payment)
```bash
curl -X POST http://localhost:3000/api/bookings/{bookingId}/confirm \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "paymentMethod": "card",
    "cardDetails": {
      "number": "4111111111111111",
      "expiry": "12/26",
      "cvv": "123",
      "name": "John Doe"
    }
  }'
```

### 6. View My Bookings
```bash
curl http://localhost:3000/api/bookings \
  -H "Authorization: Bearer {token}"
```

### 7. Cancel Booking
```bash
curl -X DELETE http://localhost:3000/api/bookings/{bookingId} \
  -H "Authorization: Bearer {token}"
```

## Error Cases

### Seat Already Taken
```bash
# Returns 400: "Seat 12A is not available"
```

### Confirm Without Seats
```bash
# Returns 400: "All passengers must have seat assignments"
```

### Booking Expired (>15 min)
```bash
# Returns 404: "Booking not found or expired"
```
