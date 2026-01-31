// User Form Component - 012-admin-panel

import { Component, Input, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { User, UserRole } from '../../../../models/auth.model';
import { CreateUserData, UpdateUserData, AirlineSummary } from '../../../../models/admin.model';

@Component({
  selector: 'app-user-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-form.html',
  styleUrl: './user-form.scss'
})
export class UserForm implements OnInit {
  @Input() user: User | null = null;
  @Output() save = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  private adminService = inject(AdminService);

  // Form fields
  email = signal('');
  firstName = signal('');
  lastName = signal('');
  role = signal<'airline' | 'admin'>('airline');
  tempPassword = signal('');
  airlineId = signal<string>('');

  // UI state
  isLoading = signal(false);
  error = signal<string | null>(null);
  airlines = signal<AirlineSummary[]>([]);

  get isEditMode(): boolean {
    return !!this.user;
  }

  get formTitle(): string {
    return this.isEditMode ? 'Edit User' : 'Create User';
  }

  ngOnInit(): void {
    this.airlines.set(this.adminService.getAllAirlines());

    if (this.user) {
      this.email.set(this.user.email);
      this.firstName.set(this.user.firstName);
      this.lastName.set(this.user.lastName);
      this.role.set(this.user.role === 'passenger' ? 'airline' : this.user.role as 'airline' | 'admin');
      this.airlineId.set((this.user as any).airlineId || '');
    }
  }

  async onSubmit(): Promise<void> {
    this.error.set(null);

    if (!this.firstName() || !this.lastName() || !this.email()) {
      this.error.set('Please fill in all required fields');
      return;
    }

    if (!this.isEditMode && !this.tempPassword()) {
      this.error.set('Please provide a temporary password');
      return;
    }

    this.isLoading.set(true);

    try {
      if (this.isEditMode && this.user) {
        const data: UpdateUserData = {
          firstName: this.firstName(),
          lastName: this.lastName(),
          email: this.email()
        };
        await this.adminService.updateUser(this.user.id, data);
      } else {
        const data: CreateUserData = {
          email: this.email(),
          firstName: this.firstName(),
          lastName: this.lastName(),
          role: this.role(),
          tempPassword: this.tempPassword(),
          airlineId: this.role() === 'airline' ? this.airlineId() : undefined
        };
        await this.adminService.createUser(data);
      }

      this.save.emit();
    } catch (err: any) {
      this.error.set(err.message || 'An error occurred');
    } finally {
      this.isLoading.set(false);
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onCancel();
    }
  }

  generatePassword(): void {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    this.tempPassword.set(password);
  }
}
