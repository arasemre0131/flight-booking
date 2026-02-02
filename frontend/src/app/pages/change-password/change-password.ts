import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePasswordPage {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  form: FormGroup;
  error = signal<string | null>(null);
  isLoading = signal(false);

  constructor() {
    // Redirect if not logged in or doesn't need password change
    const user = this.authService.currentUser();
    if (!user || !user.mustChangePassword) {
      this.router.navigate(['/']);
    }

    this.form = this.fb.group({
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { newPassword, confirmPassword } = this.form.value;

    if (newPassword !== confirmPassword) {
      this.error.set('Passwords do not match');
      return;
    }

    this.error.set(null);
    this.isLoading.set(true);

    // First login - no current password needed
    const result = await this.authService.changePassword('', newPassword);

    this.isLoading.set(false);

    if (result.success) {
      const user = this.authService.currentUser();
      if (user?.role === 'airline') {
        this.router.navigate(['/airline']);
      } else if (user?.role === 'admin') {
        this.router.navigate(['/admin']);
      } else {
        this.router.navigate(['/']);
      }
    } else {
      this.error.set(result.error || 'Failed to change password');
    }
  }

  hasError(field: string, error: string): boolean {
    const control = this.form.get(field);
    return control ? control.hasError(error) && control.touched : false;
  }
}
