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
  // Only matches airports where city or code STARTS WITH the query
  search(query: string): Observable<Airport[]> {
    if (!query || query.length < 2) {
      return of([]);
    }

    const normalizedQuery = query.toLowerCase().trim();

    return this.loadAirports().pipe(
      map(airports => {
        // Filter: only city or code that STARTS WITH query
        const matches = airports.filter(airport =>
          airport.city.toLowerCase().startsWith(normalizedQuery) ||
          airport.code.toLowerCase().startsWith(normalizedQuery)
        );

        // Sort by relevance
        return matches.sort((a, b) => {
          const aCode = a.code.toLowerCase();
          const aCity = a.city.toLowerCase();
          const bCode = b.code.toLowerCase();
          const bCity = b.city.toLowerCase();

          // Exact code match first
          if (aCode === normalizedQuery && bCode !== normalizedQuery) return -1;
          if (bCode === normalizedQuery && aCode !== normalizedQuery) return 1;

          // Code starts with query
          if (aCode.startsWith(normalizedQuery) && !bCode.startsWith(normalizedQuery)) return -1;
          if (bCode.startsWith(normalizedQuery) && !aCode.startsWith(normalizedQuery)) return 1;

          // Alphabetical by city
          return aCity.localeCompare(bCity);
        });
      }),
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
