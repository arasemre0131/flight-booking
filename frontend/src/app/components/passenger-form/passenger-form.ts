import { Component, input, output, computed, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Passenger, generatePassengerId, getPassengerLabel } from '../../models/passenger.model';

@Component({
  selector: 'app-passenger-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './passenger-form.html',
  styleUrl: './passenger-form.scss'
})
export class PassengerForm implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  passengerIndex = input.required<number>();
  passengerType = input.required<'adult' | 'child'>();
  isPrimary = input<boolean>(false);
  initialData = input<Partial<Passenger> | null>(null);

  // Outputs
  passengerChange = output<Passenger>();
  validityChange = output<boolean>();

  // Form group
  form!: FormGroup;

  // Computed values
  passengerLabel = computed(() => getPassengerLabel(this.passengerIndex(), this.passengerType()));
  showContactFields = computed(() => this.isPrimary() && this.passengerType() === 'adult');

  // Phone validation pattern (international format)
  private phonePattern = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}[-\s\.]?[0-9]{0,6}$/;

  ngOnInit(): void {
    this.initForm();
    this.setupValueChanges();

    // Restore initial data if provided
    const initial = this.initialData();
    if (initial) {
      this.form.patchValue({
        firstName: initial.firstName || '',
        middleName: initial.middleName || '',
        lastName: initial.lastName || '',
        suffix: initial.suffix || '',
        dateOfBirth: initial.dateOfBirth ? this.formatDateForInput(initial.dateOfBirth) : '',
        email: initial.email || '',
        phone: initial.phone || ''
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(1)]],
      middleName: [''],
      lastName: ['', [Validators.required, Validators.minLength(1)]],
      suffix: [''],
      dateOfBirth: ['', [Validators.required]],
      email: [''],
      phone: ['']
    });

    // Add conditional validators for primary adult
    if (this.showContactFields()) {
      this.form.get('email')?.setValidators([Validators.required, Validators.email]);
      this.form.get('phone')?.setValidators([Validators.required, Validators.pattern(this.phonePattern)]);
    }
  }

  private setupValueChanges(): void {
    this.form.valueChanges.subscribe(() => {
      this.validityChange.emit(this.form.valid);

      if (this.form.valid) {
        const formValue = this.form.value;
        const passenger: Passenger = {
          id: generatePassengerId(),
          firstName: formValue.firstName,
          middleName: formValue.middleName || undefined,
          lastName: formValue.lastName,
          suffix: formValue.suffix || undefined,
          dateOfBirth: new Date(formValue.dateOfBirth),
          email: formValue.email || undefined,
          phone: formValue.phone || undefined,
          type: this.passengerType(),
          isPrimary: this.isPrimary()
        };
        this.passengerChange.emit(passenger);
      }
    });

    // Emit initial validity
    this.validityChange.emit(this.form.valid);
  }

  private formatDateForInput(date: Date): string {
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  // Helper methods for template
  hasError(fieldName: string, errorType: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.hasError(errorType) && control.touched : false;
  }

  isInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control ? control.invalid && control.touched : false;
  }
}
