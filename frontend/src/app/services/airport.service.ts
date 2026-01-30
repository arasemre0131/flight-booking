import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { Airport } from '../models/airport.model';

@Injectable({ providedIn: 'root' })
export class AirportService {
  private http = inject(HttpClient);
  private airports: Airport[] = [];
  private loaded = false;

  // Load airports from JSON file
  private loadAirports(): Observable<Airport[]> {
    if (this.loaded) {
      return of(this.airports);
    }

    return this.http.get<Airport[]>('/assets/data/airports.json').pipe(
      map(airports => {
        this.airports = airports;
        this.loaded = true;
        return airports;
      }),
      catchError(() => {
        console.error('Failed to load airports data');
        return of([]);
      })
    );
  }

  // Search airports by query (min 2 characters)
  search(query: string): Observable<Airport[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    const normalizedQuery = query.toLowerCase().trim();

    return this.loadAirports().pipe(
      map(airports => airports.filter(airport =>
        airport.city.toLowerCase().includes(normalizedQuery) ||
        airport.name.toLowerCase().includes(normalizedQuery) ||
        airport.code.toLowerCase().includes(normalizedQuery) ||
        airport.country.toLowerCase().includes(normalizedQuery)
      )),
      map(results => results.slice(0, 10)) // Limit to 10 results
    );
  }

  // Get airport by IATA code
  getByCode(code: string): Observable<Airport | undefined> {
    return this.loadAirports().pipe(
      map(airports => airports.find(a => a.code.toUpperCase() === code.toUpperCase()))
    );
  }

  // Get all airports
  getAll(): Observable<Airport[]> {
    return this.loadAirports();
  }
}
