# Individual Project Report

**Course:** Tecnologie e Applicazioni Web 2024/2025
**Student:** Gökhan Emre Aras
**Student ID:** 907842
**Project:** SkyRoute - Flight Booking Web Application

---

## About the Project

This is a flight booking system. Users can search for flights, book tickets, and select seats. Airlines can manage their own flights, and admins can control the entire system.

I completed this project entirely on my own.

---

## What I Did

### Frontend (Angular)

The frontend took longer because I had to match the Figma design exactly. Colors, spacing, images - everything had to be pixel-perfect.

To make things manageable, I divided the work into specs:
- Header/Footer
- Search form and sub-components (airport autocomplete, date picker, passenger selector)
- Landing page
- Search results page
- Passenger info form
- Seat selection (interactive seat map)
- Payment page
- Confirmation page
- Admin and airline dashboards

I worked through each spec one by one, which made the process smooth.

### Backend (Node.js + Express)

I built the REST API. Main endpoints:
- Auth (login, register, password change)
- Flight search
- Booking operations (create, seat selection, confirm, cancel)
- Admin operations (user management, airline creation)
- Airline operations (route, aircraft, flight management)

Used MongoDB with Mongoose. JWT authentication with bcrypt password hashing.

### Real-time Feature

I implemented real-time seat updates using Socket.io. When someone books a seat, other users see it immediately. This turned out to be a nice feature.

### Docker

Three containers: frontend (served with nginx), backend (node), mongodb. Just run docker-compose up and everything starts.

---

## What I Learned

Before this project, I already knew Node.js, Express, MongoDB, and Docker to some extent. But I learned these specifically for this project:

**Angular:** I had never used Angular before. I learned the new Angular 17+ features like Signals, computed, and effect. Component-based architecture, routing, services - all from scratch.

**Socket.io:** Used Socket.io for real-time communication. Room concept, event emit/listen pattern, frontend-backend socket connection - learned all of this during this project.

---

## Problems I Faced

### Seat Pricing Bug

There was a bug in seat pricing. Business and First Class seats weren't showing extra fees, always showing 0. Economy exit row worked correctly but others didn't.

Found the issue: In `seat-map.data.ts`, the SEAT_PRICES object was defined but the createSeat function wasn't using these prices, always assigning 0. Fixed it, now each seat type gets its correct price:
- First Class: +$199
- Business: +$99
- Economy: Free
- Exit Row: +$50

### Other Minor Issues

Besides this, I didn't face any major problems. Dividing the work into specs and progressing step by step kept things organized.

---

## If I Had More Time

I would make the project more industry-standard by adding:

- **Test coverage:** Unit tests and e2e tests. Currently there are none.
- **Error handling:** More comprehensive error management, clearer user messages
- **Validation:** Stricter validation on both frontend and backend
- **Performance:** Better lazy loading, image optimization
- **Security:** Rate limiting, CSRF protection, more secure session management
- **CI/CD:** Automated build and deploy with GitHub Actions
- **Logging:** Proper logging system for production debugging

---

## Technologies Used

| Layer | Technology |
|-------|------------|
| Frontend | Angular 17+, TypeScript, SCSS |
| Backend | Node.js, Express.js, TypeScript |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Real-time | Socket.io |
| Container | Docker, Docker Compose |

---

## Conclusion

The project meets all TAW requirements:
- 3 different user types (passenger, airline, admin)
- CRUD operations
- REST API
- JWT authentication
- Real-time feature (WebSocket)
- Docker containerization
- MongoDB NoSQL database

I completed this project on my own.

---

*Gökhan Emre Aras - 907842*
