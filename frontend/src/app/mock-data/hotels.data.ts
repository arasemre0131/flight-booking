import { Hotel } from '../models/hotel.model';

export const MOCK_HOTELS: Hotel[] = [
  {
    id: 'HTL001',
    name: 'Hotel Kaneyamaen',
    description: 'Traditional ryokan experience',
    image: 'assets/images/search-results/hotel-kaneyamaen.png',
    pricePerNight: 439
  },
  {
    id: 'HTL002',
    name: 'HOTEL THE FLAG',
    description: 'Modern city hotel in Osaka',
    image: 'assets/images/search-results/hotel-osaka.png',
    pricePerNight: 139
  },
  {
    id: 'HTL003',
    name: '9 Hours Shinjuku',
    description: 'Capsule hotel experience',
    image: 'assets/images/search-results/hotel-shinjuku.png',
    pricePerNight: 59
  }
];
