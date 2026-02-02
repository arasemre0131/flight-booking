import { Component, signal, output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BillingAddress } from '../../models/payment.model';
import { COUNTRIES, STATES_BY_COUNTRY, State, countryHasStates } from '../../mock-data/countries.data';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-billing-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './billing-form.html',
  styleUrl: './billing-form.scss'
})
export class BillingForm implements OnInit, OnDestroy {
  // Output to notify parent of billing address changes
  billingAddressChange = output<BillingAddress | null>();
  formValidChange = output<boolean>();

  form: FormGroup;

  // Countries and states data
  countries = COUNTRIES;
  states = signal<State[]>([]);
  showStateDropdown = signal(false);

  // Track which fields have been touched
  touched = signal<Record<string, boolean>>({});

  private formSubscription?: Subscription;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      street: ['', [Validators.required]],
      city: ['', [Validators.required]],
      state: ['', [Validators.required]],
      postalCode: ['', [Validators.required]],
      country: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Subscribe to form status changes to emit validity
    this.formSubscription = this.form.statusChanges.subscribe(() => {
      this.formValidChange.emit(this.form.valid);
      this.emitBillingAddress();
    });

    // Emit initial validity
    this.formValidChange.emit(this.form.valid);
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  // Handle country change
  onCountryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const countryCode = select.value;

    this.form.get('country')?.setValue(countryCode);

    // Update state field based on country
    if (countryHasStates(countryCode)) {
      this.states.set(STATES_BY_COUNTRY[countryCode] || []);
      this.showStateDropdown.set(true);
      this.form.get('state')?.setValue('');
    } else {
      this.states.set([]);
      this.showStateDropdown.set(false);
      this.form.get('state')?.setValue('');
    }

    this.emitBillingAddress();
  }

  // Handle state change (dropdown)
  onStateChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.form.get('state')?.setValue(select.value);
    this.emitBillingAddress();
  }

  // Handle text input changes
  onInputChange(field: string): void {
    this.emitBillingAddress();
  }

  // Mark field as touched
  markTouched(field: string): void {
    this.touched.update(t => ({ ...t, [field]: true }));
  }

  // Check if field should show error
  shouldShowError(field: string): boolean {
    const control = this.form.get(field);
    return !!(control?.invalid && this.touched()[field]);
  }

  // Get error message for field
  getErrorMessage(field: string): string {
    const control = this.form.get(field);
    if (!control?.errors) return '';

    if (control.errors['required']) {
      const labels: Record<string, string> = {
        street: 'Street address',
        city: 'City',
        state: 'State/Province',
        postalCode: 'Postal code',
        country: 'Country'
      };
      return `${labels[field] || 'This field'} is required`;
    }

    return 'Invalid value';
  }

  // Emit billing address to parent
  private emitBillingAddress(): void {
    if (this.form.valid) {
      const address: BillingAddress = {
        street: this.form.get('street')?.value,
        city: this.form.get('city')?.value,
        state: this.form.get('state')?.value,
        postalCode: this.form.get('postalCode')?.value,
        country: this.form.get('country')?.value
      };
      this.billingAddressChange.emit(address);
    } else {
      this.billingAddressChange.emit(null);
    }
  }
}
