import mongoose from 'mongoose';
import { User } from '../models/user.model';
import { Airline } from '../models/airline.model';
import { Route } from '../models/route.model';
import { Aircraft } from '../models/aircraft.model';
import { Flight } from '../models/flight.model';
import { hashPassword } from '../utils/password.util';

export async function seedTestData(): Promise<void> {
  console.log('🌱 Starting test data seed...');

  try {
    // Check if test data already exists
    const existingAirline = await Airline.findOne({ code: 'HA' });
    if (existingAirline) {
      console.log('ℹ️  Test data already exists, skipping seed');
      return;
    }

    // ============ Create Airlines ============
    console.log('Creating airlines...');

    const hawaiianAirlines = await Airline.create({
      name: 'Hawaiian Airlines',
      code: 'HA',
      contactEmail: 'contact@hawaiianairlines.com',
      contactPhone: '+1-800-367-5320'
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

    console.log('✅ Created 3 airlines');

    // ============ Create Airline Users ============
    console.log('Creating airline operator accounts...');

    const hawaiianPassword = await hashPassword('hawaiian123');
    await User.create({
      email: 'operator@hawaiianairlines.com',
      password: hawaiianPassword,
      firstName: 'Hawaiian',
      lastName: 'Operator',
      role: 'airline',
      status: 'active',
      airlineId: hawaiianAirlines._id,
      mustChangePassword: false
    });

    const deltaPassword = await hashPassword('delta123');
    await User.create({
      email: 'operator@delta.com',
      password: deltaPassword,
      firstName: 'Delta',
      lastName: 'Operator',
      role: 'airline',
      status: 'active',
      airlineId: deltaAirlines._id,
      mustChangePassword: false
    });

    console.log('✅ Created airline operator accounts');

    // ============ Create Passenger ============
    console.log('Creating test passenger account...');

    const passengerPassword = await hashPassword('passenger123');
    await User.create({
      email: 'passenger@test.com',
      password: passengerPassword,
      firstName: 'Test',
      lastName: 'Passenger',
      role: 'passenger',
      status: 'active',
      mustChangePassword: false
    });

    console.log('✅ Created test passenger account');

    // ============ Create Routes ============
    console.log('Creating routes...');

    const routes = [
      // Hawaiian Airlines routes
      { airlineId: hawaiianAirlines._id, originAirport: 'HNL', destinationAirport: 'LAX', flightNumber: 'HA11' },
      { airlineId: hawaiianAirlines._id, originAirport: 'LAX', destinationAirport: 'HNL', flightNumber: 'HA12' },
      { airlineId: hawaiianAirlines._id, originAirport: 'HNL', destinationAirport: 'SFO', flightNumber: 'HA21' },
      { airlineId: hawaiianAirlines._id, originAirport: 'SFO', destinationAirport: 'HNL', flightNumber: 'HA22' },
      // Delta routes
      { airlineId: deltaAirlines._id, originAirport: 'JFK', destinationAirport: 'LAX', flightNumber: 'DL100' },
      { airlineId: deltaAirlines._id, originAirport: 'LAX', destinationAirport: 'JFK', flightNumber: 'DL101' },
      { airlineId: deltaAirlines._id, originAirport: 'ATL', destinationAirport: 'MIA', flightNumber: 'DL200' },
      { airlineId: deltaAirlines._id, originAirport: 'MIA', destinationAirport: 'ATL', flightNumber: 'DL201' },
      { airlineId: deltaAirlines._id, originAirport: 'JFK', destinationAirport: 'ORD', flightNumber: 'DL300' },
      { airlineId: deltaAirlines._id, originAirport: 'ORD', destinationAirport: 'JFK', flightNumber: 'DL301' },
      // United routes
      { airlineId: unitedAirlines._id, originAirport: 'SFO', destinationAirport: 'ORD', flightNumber: 'UA400' },
      { airlineId: unitedAirlines._id, originAirport: 'ORD', destinationAirport: 'SFO', flightNumber: 'UA401' },
      { airlineId: unitedAirlines._id, originAirport: 'DEN', destinationAirport: 'LAX', flightNumber: 'UA500' },
      { airlineId: unitedAirlines._id, originAirport: 'LAX', destinationAirport: 'DEN', flightNumber: 'UA501' },
    ];

    const createdRoutes = await Route.insertMany(routes.map(r => ({ ...r, isActive: true })));
    console.log(`✅ Created ${createdRoutes.length} routes`);

    // ============ Create Aircraft ============
    console.log('Creating aircraft...');

    const aircraft = [
      // Hawaiian Airlines aircraft
      {
        airlineId: hawaiianAirlines._id,
        aircraftModel: 'Airbus A330-200',
        registration: 'N380HA',
        seatConfiguration: {
          firstClass: { rows: 2, seatsPerRow: 2 },
          business: { rows: 4, seatsPerRow: 4 },
          economy: { rows: 30, seatsPerRow: 6 }
        },
        totalSeats: 200
      },
      {
        airlineId: hawaiianAirlines._id,
        aircraftModel: 'Boeing 717-200',
        registration: 'N488HA',
        seatConfiguration: {
          firstClass: { rows: 0, seatsPerRow: 0 },
          business: { rows: 2, seatsPerRow: 4 },
          economy: { rows: 20, seatsPerRow: 5 }
        },
        totalSeats: 108
      },
      // Delta aircraft
      {
        airlineId: deltaAirlines._id,
        aircraftModel: 'Boeing 737-800',
        registration: 'N3730B',
        seatConfiguration: {
          firstClass: { rows: 2, seatsPerRow: 2 },
          business: { rows: 3, seatsPerRow: 4 },
          economy: { rows: 25, seatsPerRow: 6 }
        },
        totalSeats: 166
      },
      {
        airlineId: deltaAirlines._id,
        aircraftModel: 'Airbus A321neo',
        registration: 'N501DA',
        seatConfiguration: {
          firstClass: { rows: 1, seatsPerRow: 2 },
          business: { rows: 4, seatsPerRow: 4 },
          economy: { rows: 28, seatsPerRow: 6 }
        },
        totalSeats: 186
      },
      // United aircraft
      {
        airlineId: unitedAirlines._id,
        aircraftModel: 'Boeing 777-300ER',
        registration: 'N2135U',
        seatConfiguration: {
          firstClass: { rows: 3, seatsPerRow: 2 },
          business: { rows: 6, seatsPerRow: 4 },
          economy: { rows: 35, seatsPerRow: 6 }
        },
        totalSeats: 240
      },
    ];

    const createdAircraft = await Aircraft.insertMany(aircraft);
    console.log(`✅ Created ${createdAircraft.length} aircraft`);

    // ============ Create Flights ============
    console.log('Creating flights...');

    const today = new Date();
    const flights = [];

    // Create flights for the next 7 days
    for (let day = 0; day < 7; day++) {
      const flightDate = new Date(today);
      flightDate.setDate(flightDate.getDate() + day);

      // Hawaiian Airlines flights
      const haRoute1 = createdRoutes.find(r => r.flightNumber === 'HA11');
      const haAircraft1 = createdAircraft.find(a => a.registration === 'N380HA');
      if (haRoute1 && haAircraft1) {
        const dep1 = new Date(flightDate);
        dep1.setHours(8, 0, 0, 0);
        const arr1 = new Date(dep1);
        arr1.setHours(arr1.getHours() + 5, 30);

        flights.push({
          airlineId: hawaiianAirlines._id,
          routeId: haRoute1._id,
          aircraftId: haAircraft1._id,
          departureTime: dep1,
          arrivalTime: arr1,
          pricing: { economy: 299, business: 799, firstClass: 1499 },
          status: 'scheduled'
        });
      }

      // Delta flights
      const dlRoute1 = createdRoutes.find(r => r.flightNumber === 'DL100');
      const dlAircraft1 = createdAircraft.find(a => a.registration === 'N3730B');
      if (dlRoute1 && dlAircraft1) {
        const dep2 = new Date(flightDate);
        dep2.setHours(10, 30, 0, 0);
        const arr2 = new Date(dep2);
        arr2.setHours(arr2.getHours() + 5, 45);

        flights.push({
          airlineId: deltaAirlines._id,
          routeId: dlRoute1._id,
          aircraftId: dlAircraft1._id,
          departureTime: dep2,
          arrivalTime: arr2,
          pricing: { economy: 249, business: 649, firstClass: 1299 },
          status: 'scheduled'
        });
      }

      const dlRoute2 = createdRoutes.find(r => r.flightNumber === 'DL200');
      const dlAircraft2 = createdAircraft.find(a => a.registration === 'N501DA');
      if (dlRoute2 && dlAircraft2) {
        const dep3 = new Date(flightDate);
        dep3.setHours(14, 0, 0, 0);
        const arr3 = new Date(dep3);
        arr3.setHours(arr3.getHours() + 2, 15);

        flights.push({
          airlineId: deltaAirlines._id,
          routeId: dlRoute2._id,
          aircraftId: dlAircraft2._id,
          departureTime: dep3,
          arrivalTime: arr3,
          pricing: { economy: 149, business: 399, firstClass: 899 },
          status: 'scheduled'
        });
      }

      // United flights
      const uaRoute1 = createdRoutes.find(r => r.flightNumber === 'UA400');
      const uaAircraft1 = createdAircraft.find(a => a.registration === 'N2135U');
      if (uaRoute1 && uaAircraft1) {
        const dep4 = new Date(flightDate);
        dep4.setHours(7, 0, 0, 0);
        const arr4 = new Date(dep4);
        arr4.setHours(arr4.getHours() + 4, 0);

        flights.push({
          airlineId: unitedAirlines._id,
          routeId: uaRoute1._id,
          aircraftId: uaAircraft1._id,
          departureTime: dep4,
          arrivalTime: arr4,
          pricing: { economy: 199, business: 549, firstClass: 1199 },
          status: 'scheduled'
        });
      }
    }

    const createdFlights = await Flight.insertMany(flights);
    console.log(`✅ Created ${createdFlights.length} flights`);

    console.log('\n🎉 Test data seed completed successfully!\n');
    console.log('Test Accounts:');
    console.log('─────────────────────────────────────');
    console.log('Admin:     admin@skyroute.com / admin123');
    console.log('Passenger: passenger@test.com / passenger123');
    console.log('Hawaiian:  operator@hawaiianairlines.com / hawaiian123');
    console.log('Delta:     operator@delta.com / delta123');
    console.log('─────────────────────────────────────\n');

  } catch (error) {
    console.error('❌ Test data seed failed:', error);
    throw error;
  }
}
