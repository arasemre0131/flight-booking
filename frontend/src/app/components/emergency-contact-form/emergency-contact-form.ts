import { Component, output, OnInit, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { EmergencyContact } from '../../models/booking.model';

@Component({
  selector: 'app-emergency-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './emergency-contact-form.html',
  styleUrl: './emergency-contact-form.scss'
})
export class EmergencyContactForm implements OnInit {
  private fb = inject(FormBuilder);

  // Inputs
  initialData = input<EmergencyContact | null | undefined>(null);

  // Outputs
  contactChange = output<EmergencyContact | undefined>();

  // Form group
  form!: FormGroup;

  // Phone validation pattern
  private phonePattern = /^[\+]?[(]?[0-9]{1,3}[)]?[-\s\.]?[(]?[0-9]{1,3}[)]?[-\s\.]?[0-9]{4,6}[-\s\.]?[0-9]{0,6}$/;

  ngOnInit(): void {
    this.initForm();
    this.setupValueChanges();

    // Restore initial data if provided
    const initial = this.initialData();
    if (initial) {
      this.form.patchValue({
        name: initial.name || '',
        phone: initial.phone || ''
      });
    }
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [''],
      phone: ['', [Validators.pattern(this.phonePattern)]]
    });
  }

  private setupValueChanges(): void {
    this.form.valueChanges.subscribe(() => {
      const formValue = this.form.value;

      // Only emit if both fields have values (section is being used)
      if (formValue.name && formValue.phone && this.form.valid) {
        const contact: EmergencyContact = {
          name: formValue.name,
          phone: formValue.phone
        };
        this.contactChange.emit(contact);
      } else if (!formValue.name && !formValue.phone) {
        // Section is empty, emit undefined
        this.contactChange.emit(undefined);
      }
    });

    // Emit initial state
    this.contactChange.emit(undefined);
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
