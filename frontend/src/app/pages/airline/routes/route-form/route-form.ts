// Route Form Page - 011-airline-dashboard

import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AirlineService } from '../../../../services/airline.service';
import { AirportService } from '../../../../services/airport.service';
import { Airport } from '../../../../models/airport.model';

@Component({
  selector: 'app-route-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './route-form.html',
  styleUrl: './route-form.scss'
})
export class RouteForm implements OnInit {
  private fb = inject(FormBuilder);
  private airlineService = inject(AirlineService);
  private airportService = inject(AirportService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  form!: FormGroup;
  isEditMode = signal(false);
  routeId = signal<string | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  airports: Airport[] = [];
  filteredOriginAirports = signal<Airport[]>([]);
  filteredDestAirports = signal<Airport[]>([]);

  ngOnInit(): void {
    this.initForm();
    this.loadAirports();

    // Check if editing
    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.routeId.set(id);
      this.loadRoute(id);
    }
  }

  private loadAirports(): void {
    this.airportService.getAll().subscribe(airports => {
      this.airports = airports;
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      originAirport: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      destinationAirport: ['', [Validators.required, Validators.pattern(/^[A-Z]{3}$/)]],
      flightNumberPrefix: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}\d{1,4}$/)]]
    }, {
      validators: this.originNotEqualDestination
    });
  }

  private originNotEqualDestination(group: FormGroup): { [key: string]: boolean } | null {
    const origin = group.get('originAirport')?.value;
    const dest = group.get('destinationAirport')?.value;
    if (origin && dest && origin === dest) {
      return { sameAirport: true };
    }
    return null;
  }

  private loadRoute(id: string): void {
    const route = this.airlineService.getRouteById(id);
    if (route) {
      this.form.patchValue({
        originAirport: route.originAirport,
        destinationAirport: route.destinationAirport,
        flightNumberPrefix: route.flightNumberPrefix
      });
    } else {
      this.error.set('Route not found');
    }
  }

  filterOriginAirports(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toUpperCase();
    this.form.patchValue({ originAirport: value });
    this.filteredOriginAirports.set(
      this.airports.filter((a: Airport) =>
        a.code.includes(value) || a.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  filterDestAirports(event: Event): void {
    const value = (event.target as HTMLInputElement).value.toUpperCase();
    this.form.patchValue({ destinationAirport: value });
    this.filteredDestAirports.set(
      this.airports.filter((a: Airport) =>
        a.code.includes(value) || a.name.toLowerCase().includes(value.toLowerCase())
      )
    );
  }

  selectOriginAirport(code: string): void {
    this.form.patchValue({ originAirport: code });
    this.filteredOriginAirports.set([]);
  }

  selectDestAirport(code: string): void {
    this.form.patchValue({ destinationAirport: code });
    this.filteredDestAirports.set([]);
  }

  clearOriginDropdown(): void {
    setTimeout(() => this.filteredOriginAirports.set([]), 200);
  }

  clearDestDropdown(): void {
    setTimeout(() => this.filteredDestAirports.set([]), 200);
  }

  showOriginDropdown(): void {
    this.filteredOriginAirports.set(this.airports);
  }

  showDestDropdown(): void {
    this.filteredDestAirports.set(this.airports);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    this.isLoading.set(true);
    this.error.set(null);

    try {
      if (this.isEditMode() && this.routeId()) {
        await this.airlineService.updateRoute(this.routeId()!, this.form.value);
      } else {
        await this.airlineService.createRoute(this.form.value);
      }
      this.router.navigate(['/airline/routes']);
    } catch (err: any) {
      this.error.set(err.message || 'An error occurred');
    } finally {
      this.isLoading.set(false);
    }
  }
}
