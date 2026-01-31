// Flight Form Page - 011-airline-dashboard

import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AirlineService } from '../../../../services/airline.service';
import { AirlineFlight, FlightPricing, SeatFees } from '../../../../models/airline-stats.model';
import { AirlineRoute } from '../../../../models/airline-route.model';
import { Aircraft } from '../../../../models/aircraft.model';
import { ConfirmationDialog } from '../../../../components/airline/confirmation-dialog/confirmation-dialog';

@Component({
  selector: 'app-flight-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, ConfirmationDialog],
  templateUrl: './flight-form.html',
  styleUrl: './flight-form.scss'
})
export class FlightForm implements OnInit {
  private fb = inject(FormBuilder);
  private airlineService = inject(AirlineService);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  form!: FormGroup;
  isEditMode = signal(false);
  flightId = signal<string | null>(null);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Conflict modal state
  showConflictModal = signal(false);
  conflictFlight = signal<AirlineFlight | null>(null);

  // Data from service
  routes = this.airlineService.activeRoutes;
  aircraft = this.airlineService.activeAircraft;

  // Selected aircraft details
  selectedAircraft = signal<Aircraft | null>(null);

  // Duration display
  durationDisplay = signal<string>('--');

  ngOnInit(): void {
    this.initForm();

    const id = this.activatedRoute.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode.set(true);
      this.flightId.set(id);
      this.loadFlight(id);
    } else {
      // Set default pricing
      this.setDefaultPricing();
    }

    // Watch for time changes to update duration
    this.form.get('departureTime')?.valueChanges.subscribe(() => this.updateDuration());
    this.form.get('arrivalTime')?.valueChanges.subscribe(() => this.updateDuration());

    // Watch for aircraft changes to update pricing availability
    this.form.get('aircraftId')?.valueChanges.subscribe(aircraftId => {
      const aircraft = this.aircraft().find(a => a.id === aircraftId);
      this.selectedAircraft.set(aircraft || null);
      this.updatePricingAvailability();
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      routeId: ['', Validators.required],
      aircraftId: ['', Validators.required],
      departureTime: ['', Validators.required],
      arrivalTime: ['', Validators.required],
      // Pricing
      economyPrice: [0, [Validators.required, Validators.min(1)]],
      businessPrice: [0],
      firstClassPrice: [0],
      // Seat fees
      aisleFee: [0, Validators.min(0)],
      windowFee: [0, Validators.min(0)],
      extraLegroomFee: [0, Validators.min(0)]
    }, {
      validators: this.arrivalAfterDepartureValidator
    });
  }

  private arrivalAfterDepartureValidator(group: FormGroup): { [key: string]: boolean } | null {
    const departure = group.get('departureTime')?.value;
    const arrival = group.get('arrivalTime')?.value;
    if (departure && arrival) {
      const depTime = new Date(departure).getTime();
      const arrTime = new Date(arrival).getTime();
      if (arrTime <= depTime) {
        return { arrivalBeforeDeparture: true };
      }
    }
    return null;
  }

  private loadFlight(id: string): void {
    const flight = this.airlineService.getFlightById(id);
    if (flight) {
      const aircraft = this.aircraft().find(a => a.id === flight.aircraftId);
      this.selectedAircraft.set(aircraft || null);

      this.form.patchValue({
        routeId: flight.routeId,
        aircraftId: flight.aircraftId,
        departureTime: this.formatDatetimeLocal(flight.departureTime),
        arrivalTime: this.formatDatetimeLocal(flight.arrivalTime),
        economyPrice: flight.pricing.economy / 100,
        businessPrice: flight.pricing.business ? flight.pricing.business / 100 : 0,
        firstClassPrice: flight.pricing.firstClass ? flight.pricing.firstClass / 100 : 0,
        aisleFee: flight.seatFees.aisle / 100,
        windowFee: flight.seatFees.window / 100,
        extraLegroomFee: flight.seatFees.extraLegroom / 100
      });

      this.updateDuration();
    } else {
      this.error.set('Flight not found');
    }
  }

  private formatDatetimeLocal(isoString: string): string {
    const date = new Date(isoString);
    return date.toISOString().slice(0, 16);
  }

  private setDefaultPricing(): void {
    this.form.patchValue({
      economyPrice: 100,
      businessPrice: 300,
      firstClassPrice: 800,
      aisleFee: 5,
      windowFee: 5,
      extraLegroomFee: 15
    });
  }

  private updatePricingAvailability(): void {
    const aircraft = this.selectedAircraft();
    if (!aircraft) return;

    // Clear business/first class prices if aircraft doesn't have them
    if (!aircraft.businessConfig) {
      this.form.patchValue({ businessPrice: 0 });
    }
    if (!aircraft.firstClassConfig) {
      this.form.patchValue({ firstClassPrice: 0 });
    }
  }

  private updateDuration(): void {
    const departure = this.form.get('departureTime')?.value;
    const arrival = this.form.get('arrivalTime')?.value;

    if (departure && arrival) {
      const depTime = new Date(departure).getTime();
      const arrTime = new Date(arrival).getTime();
      const diffMinutes = Math.round((arrTime - depTime) / 60000);

      if (diffMinutes > 0) {
        const hours = Math.floor(diffMinutes / 60);
        const minutes = diffMinutes % 60;
        this.durationDisplay.set(
          hours > 0
            ? `${hours}h ${minutes}m`
            : `${minutes}m`
        );
      } else {
        this.durationDisplay.set('Invalid');
      }
    } else {
      this.durationDisplay.set('--');
    }
  }

  getRouteName(route: AirlineRoute): string {
    return `${route.originAirport} → ${route.destinationAirport} (${route.flightNumberPrefix})`;
  }

  checkConflict(): void {
    const aircraftId = this.form.get('aircraftId')?.value;
    const departure = this.form.get('departureTime')?.value;
    const arrival = this.form.get('arrivalTime')?.value;

    if (!aircraftId || !departure || !arrival) return;

    const conflict = this.airlineService.checkAircraftConflict(
      aircraftId,
      new Date(departure).toISOString(),
      new Date(arrival).toISOString(),
      this.flightId() || undefined
    );

    if (conflict) {
      this.conflictFlight.set(conflict);
      this.showConflictModal.set(true);
    }
  }

  closeConflictModal(): void {
    this.showConflictModal.set(false);
    this.conflictFlight.set(null);
  }

  proceedWithConflict(): void {
    this.closeConflictModal();
    this.submitForm(true);
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) return;

    // Check for conflict before saving
    const aircraftId = this.form.get('aircraftId')?.value;
    const departure = this.form.get('departureTime')?.value;
    const arrival = this.form.get('arrivalTime')?.value;

    const conflict = this.airlineService.checkAircraftConflict(
      aircraftId,
      new Date(departure).toISOString(),
      new Date(arrival).toISOString(),
      this.flightId() || undefined
    );

    if (conflict) {
      this.conflictFlight.set(conflict);
      this.showConflictModal.set(true);
      return;
    }

    await this.submitForm(false);
  }

  private async submitForm(ignoreConflict: boolean): Promise<void> {
    this.isLoading.set(true);
    this.error.set(null);

    const pricing: FlightPricing = {
      economy: Math.round(this.form.value.economyPrice * 100),
      business: this.selectedAircraft()?.businessConfig
        ? Math.round(this.form.value.businessPrice * 100)
        : null,
      firstClass: this.selectedAircraft()?.firstClassConfig
        ? Math.round(this.form.value.firstClassPrice * 100)
        : null
    };

    const seatFees: SeatFees = {
      aisle: Math.round(this.form.value.aisleFee * 100),
      window: Math.round(this.form.value.windowFee * 100),
      extraLegroom: Math.round(this.form.value.extraLegroomFee * 100)
    };

    const flightData = {
      routeId: this.form.value.routeId,
      aircraftId: this.form.value.aircraftId,
      departureTime: new Date(this.form.value.departureTime).toISOString(),
      arrivalTime: new Date(this.form.value.arrivalTime).toISOString(),
      pricing,
      seatFees
    };

    try {
      if (this.isEditMode() && this.flightId()) {
        await this.airlineService.updateFlight(this.flightId()!, flightData);
      } else {
        await this.airlineService.createFlight(flightData);
      }
      this.router.navigate(['/airline/flights']);
    } catch (err: any) {
      if (!ignoreConflict || !err.message?.includes('conflict')) {
        this.error.set(err.message || 'An error occurred');
      }
    } finally {
      this.isLoading.set(false);
    }
  }
}
