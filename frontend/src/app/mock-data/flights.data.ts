// Flights Mock Data

import { Flight } from '../models/flight.model';
import { AIRLINES } from './airlines.data';

export const MOCK_FLIGHTS: Flight[] = [
  {
    id: 'FL001',
    airline: AIRLINES[0], // Hawaiian Airlines
    departureTime: '7:00 AM',
    arrivalTime: '4:15 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '16h 45m',
    stops: 1,
    layovers: [{ airport: 'HNL', duration: '2h 45m' }],
    price: 624
  },
  {
    id: 'FL002',
    airline: AIRLINES[0], // Hawaiian Airlines
    departureTime: '7:00 AM',
    arrivalTime: '4:15 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '16h 45m',
    stops: 1,
    layovers: [{ airport: 'HNL', duration: '2h 45m' }],
    price: 624
  },
  {
    id: 'FL003',
    airline: AIRLINES[4], // Japan Airlines
    departureTime: '10:35 AM',
    arrivalTime: '3:45 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '11h 10m',
    stops: 0,
    price: 663
  },
  {
    id: 'FL004',
    airline: AIRLINES[1], // United Airlines
    departureTime: '9:20 AM',
    arrivalTime: '2:30 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '11h 10m',
    stops: 0,
    price: 756
  },
  {
    id: 'FL005',
    airline: AIRLINES[5], // All Nippon Airways
    departureTime: '11:00 AM',
    arrivalTime: '4:10 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '11h 10m',
    stops: 0,
    price: 789
  },
  {
    id: 'FL006',
    airline: AIRLINES[2], // American Airlines
    departureTime: '6:30 AM',
    arrivalTime: '7:45 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '19h 15m',
    stops: 2,
    layovers: [
      { airport: 'LAX', duration: '1h 30m' },
      { airport: 'HND', duration: '2h 15m' }
    ],
    price: 498
  },
  {
    id: 'FL007',
    airline: AIRLINES[3], // Delta Air Lines
    departureTime: '8:15 AM',
    arrivalTime: '1:25 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '11h 10m',
    stops: 0,
    price: 712
  },
  {
    id: 'FL008',
    airline: AIRLINES[1], // United Airlines
    departureTime: '2:45 PM',
    arrivalTime: '10:55 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '14h 10m',
    stops: 1,
    layovers: [{ airport: 'LAX', duration: '1h 45m' }],
    price: 582
  },
  {
    id: 'FL009',
    airline: AIRLINES[4], // Japan Airlines
    departureTime: '5:00 PM',
    arrivalTime: '10:10 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '11h 10m',
    stops: 0,
    price: 695
  },
  {
    id: 'FL010',
    airline: AIRLINES[0], // Hawaiian Airlines
    departureTime: '11:30 AM',
    arrivalTime: '11:45 PM',
    departureAirport: 'SFO',
    arrivalAirport: 'NRT',
    duration: '18h 15m',
    stops: 1,
    layovers: [{ airport: 'HNL', duration: '3h 30m' }],
    price: 545
  }
];
