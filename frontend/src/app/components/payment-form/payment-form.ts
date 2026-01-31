import { Component, signal, output, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { PaymentDetails, CardType } from '../../models/payment.model';
import {
  isValidLuhn,
  detectCardType,
  formatCardNumber,
  maskCardNumber,
  getCvvLength,
  isValidExpiry
} from '../../utils/card-validation';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-payment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment-form.html',
  styleUrl: './payment-form.scss'
})
export class PaymentForm implements OnInit, OnDestroy {
  // Output to notify parent of payment details changes
  paymentDetailsChange = output<PaymentDetails | null>();
  formValidChange = output<boolean>();

  form: FormGroup;
  cardType = signal<CardType | null>(null);
  isMasked = signal(false);
  displayCardNumber = signal('');

  // Track which fields have been touched for error display
  touched = signal<Record<string, boolean>>({});

  private formSubscription?: Subscription;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      cardNumber: ['', [Validators.required, this.luhnValidator.bind(this)]],
      expiryMonth: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])$/)]],
      expiryYear: ['', [Validators.required, Validators.pattern(/^\d{2}$/)]],
      cvv: ['', [Validators.required, this.cvvValidator.bind(this)]],
      cardholderName: ['', [Validators.required, Validators.minLength(2)]]
    }, {
      validators: this.expiryValidator.bind(this)
    });
  }

  ngOnInit(): void {
    // Subscribe to form status changes to emit validity
    this.formSubscription = this.form.statusChanges.subscribe(() => {
      this.formValidChange.emit(this.form.valid);
      this.emitPaymentDetails();
    });

    // Emit initial validity
    this.formValidChange.emit(this.form.valid);
  }

  ngOnDestroy(): void {
    this.formSubscription?.unsubscribe();
  }

  // Custom Luhn validator
  private luhnValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const digits = value.replace(/\D/g, '');
    if (digits.length < 13) {
      return { minlength: true };
    }
    if (!isValidLuhn(digits)) {
      return { luhn: true };
    }
    return null;
  }

  // Custom CVV validator based on card type
  private cvvValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const requiredLength = getCvvLength(this.cardType());
    const digits = value.replace(/\D/g, '');

    if (digits.length !== requiredLength) {
      return { cvvLength: { required: requiredLength, actual: digits.length } };
    }
    return null;
  }

  // Cross-field expiry date validator
  private expiryValidator(group: FormGroup): ValidationErrors | null {
    const month = group.get('expiryMonth')?.value;
    const year = group.get('expiryYear')?.value;

    if (!month || !year) return null;

    if (!isValidExpiry(month, year)) {
      return { expiryPast: true };
    }
    return null;
  }

  // Handle card number input - format and detect type
  onCardNumberInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const cursorPosition = input.selectionStart || 0;
    const oldValue = input.value;

    // Detect card type first
    const detectedType = detectCardType(input.value);
    this.cardType.set(detectedType);

    // Format the number
    const formatted = formatCardNumber(input.value, detectedType);
    input.value = formatted;
    this.displayCardNumber.set(formatted);

    // Store raw digits in form
    const rawDigits = formatted.replace(/\D/g, '');
    this.form.get('cardNumber')?.setValue(rawDigits, { emitEvent: false });
    this.form.get('cardNumber')?.updateValueAndValidity();

    // Adjust cursor position for added spaces
    const addedSpaces = (formatted.match(/ /g) || []).length - (oldValue.match(/ /g) || []).length;
    const newPosition = cursorPosition + addedSpaces;
    setTimeout(() => input.setSelectionRange(newPosition, newPosition), 0);

    // Re-validate CVV when card type changes
    this.form.get('cvv')?.updateValueAndValidity();

    this.emitPaymentDetails();
  }

  // Mask card number on blur
  onCardNumberBlur(): void {
    this.markTouched('cardNumber');
    const value = this.form.get('cardNumber')?.value;
    if (value && value.length >= 4) {
      this.isMasked.set(true);
      this.displayCardNumber.set(maskCardNumber(value));
    }
  }

  // Unmask on focus for editing
  onCardNumberFocus(): void {
    this.isMasked.set(false);
    const value = this.form.get('cardNumber')?.value;
    if (value) {
      this.displayCardNumber.set(formatCardNumber(value, this.cardType()));
    }
  }

  // Handle expiry month input
  onExpiryMonthInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let value = input.value.replace(/\D/g, '').slice(0, 2);

    // Auto-format: if first digit > 1, prepend 0
    if (value.length === 1 && parseInt(value, 10) > 1) {
      value = '0' + value;
    }

    input.value = value;
    this.form.get('expiryMonth')?.setValue(value);
    this.emitPaymentDetails();

    // Auto-advance to year field
    if (value.length === 2) {
      const yearInput = document.getElementById('expiryYear') as HTMLInputElement;
      yearInput?.focus();
    }
  }

  // Handle expiry year input
  onExpiryYearInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/\D/g, '').slice(0, 2);
    input.value = value;
    this.form.get('expiryYear')?.setValue(value);
    this.emitPaymentDetails();

    // Auto-advance to CVV field
    if (value.length === 2) {
      const cvvInput = document.getElementById('cvv') as HTMLInputElement;
      cvvInput?.focus();
    }
  }

  // Handle CVV input
  onCvvInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const maxLength = getCvvLength(this.cardType());
    const value = input.value.replace(/\D/g, '').slice(0, maxLength);
    input.value = value;
    this.form.get('cvv')?.setValue(value);
    this.emitPaymentDetails();
  }

  // Handle cardholder name input
  onCardholderNameInput(): void {
    this.emitPaymentDetails();
  }

  // Mark field as touched for error display
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

    if (control.errors['required']) return 'This field is required';
    if (control.errors['minlength']) return 'Card number is too short';
    if (control.errors['luhn']) return 'Invalid card number';
    if (control.errors['pattern']) return 'Invalid format';
    if (control.errors['cvvLength']) {
      const { required } = control.errors['cvvLength'];
      return `CVV must be ${required} digits`;
    }
    return 'Invalid value';
  }

  // Check for expiry error
  hasExpiryError(): boolean {
    return !!(this.form.errors?.['expiryPast'] &&
      (this.touched()['expiryMonth'] || this.touched()['expiryYear']));
  }

  // Emit payment details to parent
  private emitPaymentDetails(): void {
    if (this.form.valid) {
      const cardType = this.cardType();
      if (cardType) {
        const details: PaymentDetails = {
          cardNumber: this.form.get('cardNumber')?.value,
          cardType,
          expiryMonth: this.form.get('expiryMonth')?.value,
          expiryYear: this.form.get('expiryYear')?.value,
          cvv: this.form.get('cvv')?.value,
          cardholderName: this.form.get('cardholderName')?.value
        };
        this.paymentDetailsChange.emit(details);
        return;
      }
    }
    this.paymentDetailsChange.emit(null);
  }

  // Get card type icon class
  getCardTypeIcon(): string {
    const type = this.cardType();
    if (!type) return '';
    return `card-icon card-icon--${type}`;
  }
}
