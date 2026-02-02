import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { Airline } from '../models/airline.model';
import { Route } from '../models/route.model';
import { Aircraft } from '../models/aircraft.model';
import { Flight } from '../models/flight.model';
import { Booking } from '../models/booking.model';
import { Ticket } from '../models/ticket.model';
import { hashPassword } from '../utils/password.util';

export async function seedTestData(): Promise<void> {
  console.log('🌱 Starting test data seed...');

  try {
    // Check if test data already exists
    const existingAirline = await Airline.findOne({ code: 'TK' });
    if (existingAirline) {
      console.log('ℹ️  Test data already exists, skipping seed');
      return;
    }

    // ============ Create Airlines ============
    console.log('Creating airlines...');

    const turkishAirlines = await Airline.create({
      name: 'Turkish Airlines',
      code: 'TK',
      contactEmail: 'contact@turkishairlines.com',
      contactPhone: '+90-212-444-0849'
    });

    const emirates = await Airline.create({
      name: 'Emirates',
      code: 'EK',
      contactEmail: 'contact@emirates.com',
      contactPhone: '+971-600-555555'
    });

    const lufthansa = await Airline.create({
      name: 'Lufthansa',
      code: 'LH',
      contactEmail: 'contact@lufthansa.com',
      contactPhone: '+49-69-86799799'
    });

    const britishAirways = await Airline.create({
      name: 'British Airways',
      code: 'BA',
      contactEmail: 'contact@ba.com',
      contactPhone: '+44-20-8738-5050'
    });

    const deltaAirlines = await Airline.create({
      name: 'Delta Air Lines',
      code: 'DL',
      contactEmail: 'contact@delta.com',
      contactPhone: '+1-800-221-1212'
    });

    const unitedAirlines = await Airline.create({
      name: 'United Airlines',
      code: 'UA',
      contactEmail: 'contact@united.com',
      contactPhone: '+1-800-864-8331'
    });

    console.log('✅ Created 6 airlines');

    // ============ Create Airline Operator Accounts ============
    console.log('Creating airline operator accounts...');

    const operatorPassword = await hashPassword('operator123');

    const airlineOperators = [
      { email: 'operator@turkishairlines.com', firstName: 'Ahmet', lastName: 'Yilmaz', airlineId: turkishAirlines._id },
      { email: 'operator@emirates.com', firstName: 'Mohammed', lastName: 'Al-Rashid', airlineId: emirates._id },
      { email: 'operator@lufthansa.com', firstName: 'Hans', lastName: 'Mueller', airlineId: lufthansa._id },
      { email: 'operator@ba.com', firstName: 'James', lastName: 'Wilson', airlineId: britishAirways._id },
      { email: 'operator@delta.com', firstName: 'John', lastName: 'Smith', airlineId: deltaAirlines._id },
      { email: 'operator@united.com', firstName: 'Michael', lastName: 'Johnson', airlineId: unitedAirlines._id },
    ];

    for (const op of airlineOperators) {
      await User.create({
        email: op.email,
        password: operatorPassword,
        firstName: op.firstName,
        lastName: op.lastName,
        role: 'airline',
        status: 'active',
        airlineId: op.airlineId,
        mustChangePassword: false
      });
    }

    console.log('✅ Created 6 airline operator accounts');

    // ============ Create Passenger Accounts ============
    console.log('Creating passenger accounts...');

    const passengerPassword = await hashPassword('passenger123');

    const passengers = [
      { email: 'john.doe@gmail.com', firstName: 'John', lastName: 'Doe' },
      { email: 'jane.smith@gmail.com', firstName: 'Jane', lastName: 'Smith' },
      { email: 'alex.wilson@gmail.com', firstName: 'Alex', lastName: 'Wilson' },
      { email: 'maria.garcia@gmail.com', firstName: 'Maria', lastName: 'Garcia' },
      { email: 'david.brown@gmail.com', firstName: 'David', lastName: 'Brown' },
      { email: 'emma.johnson@gmail.com', firstName: 'Emma', lastName: 'Johnson' },
      { email: 'oliver.taylor@gmail.com', firstName: 'Oliver', lastName: 'Taylor' },
      { email: 'sophia.anderson@gmail.com', firstName: 'Sophia', lastName: 'Anderson' },
      { email: 'lucas.martinez@gmail.com', firstName: 'Lucas', lastName: 'Martinez' },
      { email: 'mia.thomas@gmail.com', firstName: 'Mia', lastName: 'Thomas' },
      { email: 'mehmet.ozturk@gmail.com', firstName: 'Mehmet', lastName: 'Ozturk' },
      { email: 'ayse.demir@gmail.com', firstName: 'Ayse', lastName: 'Demir' },
    ];

    const createdPassengers = [];
    for (const p of passengers) {
      const user = await User.create({
        email: p.email,
        password: passengerPassword,
        firstName: p.firstName,
        lastName: p.lastName,
        role: 'passenger',
        status: 'active',
        mustChangePassword: false
      });
      createdPassengers.push(user);
    }

    console.log(`✅ Created ${passengers.length} passenger accounts`);

    // ============ Create Routes ============
    console.log('Creating routes...');

    const routes = [
      // Turkish Airlines routes
      { airlineId: turkishAirlines._id, originAirport: 'IST', destinationAirport: 'JFK', flightNumber: 'TK1' },
      { airlineId: turkishAirlines._id, originAirport: 'JFK', destinationAirport: 'IST', flightNumber: 'TK2' },
      { airlineId: turkishAirlines._id, originAirport: 'IST', destinationAirport: 'LHR', flightNumber: 'TK1971' },
      { airlineId: turkishAirlines._id, originAirport: 'LHR', destinationAirport: 'IST', flightNumber: 'TK1972' },
      { airlineId: turkishAirlines._id, originAirport: 'IST', destinationAirport: 'CDG', flightNumber: 'TK1823' },
      { airlineId: turkishAirlines._id, originAirport: 'IST', destinationAirport: 'FRA', flightNumber: 'TK1589' },
      { airlineId: turkishAirlines._id, originAirport: 'IST', destinationAirport: 'DXB', flightNumber: 'TK758' },
      // Emirates routes
      { airlineId: emirates._id, originAirport: 'DXB', destinationAirport: 'JFK', flightNumber: 'EK201' },
      { airlineId: emirates._id, originAirport: 'JFK', destinationAirport: 'DXB', flightNumber: 'EK202' },
      { airlineId: emirates._id, originAirport: 'DXB', destinationAirport: 'LHR', flightNumber: 'EK3' },
      { airlineId: emirates._id, originAirport: 'DXB', destinationAirport: 'LAX', flightNumber: 'EK215' },
      { airlineId: emirates._id, originAirport: 'DXB', destinationAirport: 'SIN', flightNumber: 'EK354' },
      // Lufthansa routes
      { airlineId: lufthansa._id, originAirport: 'FRA', destinationAirport: 'JFK', flightNumber: 'LH400' },
      { airlineId: lufthansa._id, originAirport: 'JFK', destinationAirport: 'FRA', flightNumber: 'LH401' },
      { airlineId: lufthansa._id, originAirport: 'FRA', destinationAirport: 'LHR', flightNumber: 'LH900' },
      { airlineId: lufthansa._id, originAirport: 'MUC', destinationAirport: 'IST', flightNumber: 'LH1754' },
      // British Airways routes
      { airlineId: britishAirways._id, originAirport: 'LHR', destinationAirport: 'JFK', flightNumber: 'BA117' },
      { airlineId: britishAirways._id, originAirport: 'JFK', destinationAirport: 'LHR', flightNumber: 'BA118' },
      { airlineId: britishAirways._id, originAirport: 'LHR', destinationAirport: 'LAX', flightNumber: 'BA269' },
      { airlineId: britishAirways._id, originAirport: 'LHR', destinationAirport: 'CDG', flightNumber: 'BA304' },
      // Delta routes
      { airlineId: deltaAirlines._id, originAirport: 'JFK', destinationAirport: 'LAX', flightNumber: 'DL100' },
      { airlineId: deltaAirlines._id, originAirport: 'LAX', destinationAirport: 'JFK', flightNumber: 'DL101' },
      { airlineId: deltaAirlines._id, originAirport: 'ATL', destinationAirport: 'MIA', flightNumber: 'DL200' },
      { airlineId: deltaAirlines._id, originAirport: 'JFK', destinationAirport: 'LHR', flightNumber: 'DL1' },
      // United routes
      { airlineId: unitedAirlines._id, originAirport: 'SFO', destinationAirport: 'LHR', flightNumber: 'UA901' },
      { airlineId: unitedAirlines._id, originAirport: 'ORD', destinationAirport: 'FRA', flightNumber: 'UA906' },
      { airlineId: unitedAirlines._id, originAirport: 'EWR', destinationAirport: 'IST', flightNumber: 'UA78' },
    ];

    const createdRoutes = await Route.insertMany(routes.map(r => ({ ...r, isActive: true })));
    console.log(`✅ Created ${createdRoutes.length} routes`);

    // ============ Create Aircraft ============
    console.log('Creating aircraft...');

    const aircraft = [
      // Turkish Airlines fleet
      {
        airlineId: turkishAirlines._id,
        aircraftModel: 'Boeing 777-300ER',
        registration: 'TC-JJA',
        seatConfiguration: { firstClass: { rows: 2, seatsPerRow: 2 }, business: { rows: 7, seatsPerRow: 4 }, economy: { rows: 35, seatsPerRow: 6 } },
        totalSeats: 349
      },
      {
        airlineId: turkishAirlines._id,
        aircraftModel: 'Airbus A350-900',
        registration: 'TC-LGA',
        seatConfiguration: { firstClass: { rows: 0, seatsPerRow: 0 }, business: { rows: 8, seatsPerRow: 4 }, economy: { rows: 40, seatsPerRow: 6 } },
        totalSeats: 272
      },
      {
        airlineId: turkishAirlines._id,
        aircraftModel: 'Boeing 737-800',
        registration: 'TC-JFK',
        seatConfiguration: { firstClass: { rows: 0, seatsPerRow: 0 }, business: { rows: 3, seatsPerRow: 4 }, economy: { rows: 26, seatsPerRow: 6 } },
        totalSeats: 168
      },
      // Emirates fleet
      {
        airlineId: emirates._id,
        aircraftModel: 'Airbus A380-800',
        registration: 'A6-EDA',
        seatConfiguration: { firstClass: { rows: 7, seatsPerRow: 2 }, business: { rows: 19, seatsPerRow: 4 }, economy: { rows: 58, seatsPerRow: 6 } },
        totalSeats: 489
      },
      {
        airlineId: emirates._id,
        aircraftModel: 'Boeing 777-300ER',
        registration: 'A6-EGO',
        seatConfiguration: { firstClass: { rows: 2, seatsPerRow: 2 }, business: { rows: 7, seatsPerRow: 4 }, economy: { rows: 40, seatsPerRow: 6 } },
        totalSeats: 354
      },
      // Lufthansa fleet
      {
        airlineId: lufthansa._id,
        aircraftModel: 'Airbus A380-800',
        registration: 'D-AIMA',
        seatConfiguration: { firstClass: { rows: 4, seatsPerRow: 2 }, business: { rows: 22, seatsPerRow: 4 }, economy: { rows: 60, seatsPerRow: 6 } },
        totalSeats: 509
      },
      {
        airlineId: lufthansa._id,
        aircraftModel: 'Boeing 747-8',
        registration: 'D-ABYA',
        seatConfiguration: { firstClass: { rows: 4, seatsPerRow: 2 }, business: { rows: 20, seatsPerRow: 4 }, economy: { rows: 55, seatsPerRow: 6 } },
        totalSeats: 410
      },
      // British Airways fleet
      {
        airlineId: britishAirways._id,
        aircraftModel: 'Airbus A380-800',
        registration: 'G-XLEA',
        seatConfiguration: { firstClass: { rows: 7, seatsPerRow: 2 }, business: { rows: 22, seatsPerRow: 4 }, economy: { rows: 60, seatsPerRow: 6 } },
        totalSeats: 469
      },
      {
        airlineId: britishAirways._id,
        aircraftModel: 'Boeing 787-9',
        registration: 'G-ZBKA',
        seatConfiguration: { firstClass: { rows: 2, seatsPerRow: 2 }, business: { rows: 8, seatsPerRow: 4 }, economy: { rows: 38, seatsPerRow: 6 } },
        totalSeats: 264
      },
      // Delta fleet
      {
        airlineId: deltaAirlines._id,
        aircraftModel: 'Boeing 767-400ER',
        registration: 'N826MH',
        seatConfiguration: { firstClass: { rows: 0, seatsPerRow: 0 }, business: { rows: 10, seatsPerRow: 4 }, economy: { rows: 38, seatsPerRow: 6 } },
        totalSeats: 268
      },
      {
        airlineId: deltaAirlines._id,
        aircraftModel: 'Airbus A350-900',
        registration: 'N501DN',
        seatConfiguration: { firstClass: { rows: 0, seatsPerRow: 0 }, business: { rows: 8, seatsPerRow: 4 }, economy: { rows: 44, seatsPerRow: 6 } },
        totalSeats: 296
      },
      // United fleet
      {
        airlineId: unitedAirlines._id,
        aircraftModel: 'Boeing 787-10',
        registration: 'N12006',
        seatConfiguration: { firstClass: { rows: 0, seatsPerRow: 0 }, business: { rows: 11, seatsPerRow: 4 }, economy: { rows: 42, seatsPerRow: 6 } },
        totalSeats: 296
      },
    ];

    const createdAircraft = await Aircraft.insertMany(aircraft);
    console.log(`✅ Created ${createdAircraft.length} aircraft`);

    // ============ Create Flights ============
    console.log('Creating flights...');

    const today = new Date();
    const flights: any[] = [];

    // Helper to get random aircraft for an airline
    const getAircraftForAirline = (airlineId: mongoose.Types.ObjectId) => {
      return createdAircraft.filter(a => a.airlineId.toString() === airlineId.toString());
    };

    // Create flights for next 14 days
    for (let day = 0; day < 14; day++) {
      const flightDate = new Date(today);
      flightDate.setDate(flightDate.getDate() + day);

      for (const route of createdRoutes) {
        const airlineAircraft = getAircraftForAirline(route.airlineId as mongoose.Types.ObjectId);
        if (airlineAircraft.length === 0) continue;

        const aircraft = airlineAircraft[day % airlineAircraft.length];

        // Morning flight
        const dep1 = new Date(flightDate);
        dep1.setHours(8 + (day % 4), 0, 0, 0);
        const arr1 = new Date(dep1);
        const flightDuration = 3 + Math.floor(Math.random() * 10); // 3-12 hours
        arr1.setHours(arr1.getHours() + flightDuration);

        const economyPrice = 150 + Math.floor(Math.random() * 400);
        const businessPrice = economyPrice * 3;
        const firstClassPrice = economyPrice * 5;

        flights.push({
          airlineId: route.airlineId,
          routeId: route._id,
          aircraftId: aircraft._id,
          departureTime: dep1,
          arrivalTime: arr1,
          pricing: { economy: economyPrice, business: businessPrice, firstClass: firstClassPrice },
          status: day < 2 ? 'departed' : 'scheduled'
        });

        // Afternoon flight for popular routes
        if (day % 2 === 0) {
          const dep2 = new Date(flightDate);
          dep2.setHours(14 + (day % 3), 30, 0, 0);
          const arr2 = new Date(dep2);
          arr2.setHours(arr2.getHours() + flightDuration);

          flights.push({
            airlineId: route.airlineId,
            routeId: route._id,
            aircraftId: aircraft._id,
            departureTime: dep2,
            arrivalTime: arr2,
            pricing: { economy: economyPrice + 50, business: businessPrice + 100, firstClass: firstClassPrice + 200 },
            status: day < 2 ? 'departed' : 'scheduled'
          });
        }
      }
    }

    const createdFlights = await Flight.insertMany(flights);
    console.log(`✅ Created ${createdFlights.length} flights`);

    // ============ Create Bookings ============
    console.log('Creating bookings...');

    let ticketCounter = 0;
    const bookingsData: any[] = [];
    const ticketsData: any[] = [];

    // Create bookings for past flights (completed)
    const pastFlights = createdFlights.filter(f => f.status === 'departed');
    const futureFlights = createdFlights.filter(f => f.status === 'scheduled');

    // Assign bookings to passengers
    for (let i = 0; i < Math.min(pastFlights.length, 40); i++) {
      const flight = pastFlights[i];
      const passenger = createdPassengers[i % createdPassengers.length];
      const ticketClass = i % 3 === 0 ? 'business' : 'economy';
      const numPassengers = 1 + (i % 3);

      const passengers = [];
      for (let p = 0; p < numPassengers; p++) {
        passengers.push({
          firstName: p === 0 ? passenger.firstName : `Guest${p}`,
          lastName: passenger.lastName,
          email: passenger.email,
          phone: '+1-555-' + String(1000 + i * 10 + p).padStart(4, '0'),
          dateOfBirth: new Date(1980 + (i % 30), (i % 12), 1 + (i % 28)),
          passportNumber: `P${String(i).padStart(6, '0')}${p}`
        });
      }

      const priceKey = ticketClass as keyof typeof flight.pricing;
      const basePrice = flight.pricing[priceKey] || 200;
      const totalPrice = basePrice * numPassengers;

      const booking = {
        _id: new mongoose.Types.ObjectId(),
        userId: passenger._id,
        flightId: flight._id,
        passengers,
        ticketClass,
        extras: { additionalBaggage: i % 3, extraLegroom: i % 2 === 0 },
        status: 'confirmed',
        totalPrice,
        createdAt: new Date(Date.now() - (14 - i) * 24 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - (14 - i) * 24 * 60 * 60 * 1000)
      };

      bookingsData.push(booking);

      // Create tickets for each passenger
      for (let p = 0; p < numPassengers; p++) {
        ticketCounter++;
        const row = 10 + p + (i % 20);
        const seat = String.fromCharCode(65 + (p % 6));
        ticketsData.push({
          bookingId: booking._id,
          flightId: flight._id,
          passengerIndex: p,
          seatNumber: `${row}${seat}`,
          ticketNumber: `SKY-2026-${String(ticketCounter).padStart(6, '0')}`,
          status: 'active'
        });
      }
    }

    // Create some future bookings
    for (let i = 0; i < Math.min(futureFlights.length, 25); i++) {
      const flight = futureFlights[i];
      const passenger = createdPassengers[(i + 5) % createdPassengers.length];
      const ticketClass = i % 4 === 0 ? 'business' : 'economy';

      const passengers = [{
        firstName: passenger.firstName,
        lastName: passenger.lastName,
        email: passenger.email,
        phone: '+1-555-' + String(2000 + i).padStart(4, '0'),
        dateOfBirth: new Date(1985 + (i % 25), (i % 12), 1 + (i % 28)),
        passportNumber: `F${String(i).padStart(6, '0')}`
      }];

      const priceKey = ticketClass as keyof typeof flight.pricing;
      const basePrice = flight.pricing[priceKey] || 200;

      const booking = {
        _id: new mongoose.Types.ObjectId(),
        userId: passenger._id,
        flightId: flight._id,
        passengers,
        ticketClass,
        extras: { additionalBaggage: 0, extraLegroom: false },
        status: 'confirmed',
        totalPrice: basePrice,
        createdAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000),
        updatedAt: new Date(Date.now() - i * 2 * 60 * 60 * 1000)
      };

      bookingsData.push(booking);

      ticketCounter++;
      const row = 15 + (i % 15);
      const seat = String.fromCharCode(65 + (i % 6));
      ticketsData.push({
        bookingId: booking._id,
        flightId: flight._id,
        passengerIndex: 0,
        seatNumber: `${row}${seat}`,
        ticketNumber: `SKY-2026-${String(ticketCounter).padStart(6, '0')}`,
        status: 'active'
      });
    }

    await Booking.insertMany(bookingsData);
    await Ticket.insertMany(ticketsData);

    console.log(`✅ Created ${bookingsData.length} bookings with ${ticketsData.length} tickets`);

    console.log('\n🎉 Test data seed completed successfully!\n');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('                        TEST ACCOUNTS');
    console.log('═══════════════════════════════════════════════════════════════');
    console.log('');
    console.log('ADMIN:');
    console.log('  admin@skyroute.com / admin123');
    console.log('');
    console.log('AIRLINE OPERATORS (password: operator123):');
    console.log('  Turkish Airlines:  operator@turkishairlines.com');
    console.log('  Emirates:          operator@emirates.com');
    console.log('  Lufthansa:         operator@lufthansa.com');
    console.log('  British Airways:   operator@ba.com');
    console.log('  Delta:             operator@delta.com');
    console.log('  United:            operator@united.com');
    console.log('');
    console.log('PASSENGERS (password: passenger123):');
    console.log('  john.doe@gmail.com          jane.smith@gmail.com');
    console.log('  alex.wilson@gmail.com       maria.garcia@gmail.com');
    console.log('  david.brown@gmail.com       emma.johnson@gmail.com');
    console.log('  oliver.taylor@gmail.com     sophia.anderson@gmail.com');
    console.log('  lucas.martinez@gmail.com    mia.thomas@gmail.com');
    console.log('  mehmet.ozturk@gmail.com     ayse.demir@gmail.com');
    console.log('═══════════════════════════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Test data seed failed:', error);
    throw error;
  }
}
