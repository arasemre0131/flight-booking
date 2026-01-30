// Airlines Mock Data

import { Airline } from '../models/flight.model';

export const AIRLINES: Airline[] = [
  { code: 'HA', name: 'Hawaiian Airlines' },
  { code: 'UA', name: 'United Airlines' },
  { code: 'AA', name: 'American Airlines' },
  { code: 'DL', name: 'Delta Air Lines' },
  { code: 'JL', name: 'Japan Airlines' },
  { code: 'NH', name: 'All Nippon Airways' }
];

export function getAirlineByCode(code: string): Airline | undefined {
  return AIRLINES.find(a => a.code === code);
}
