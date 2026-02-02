// User Form Component - 012-admin-panel

import { Component, Input, Output, EventEmitter, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AdminService } from '../../../../services/admin.service';
import { User } from '../../../../models/auth.model';

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
  companyName = signal('');
  airlineCode = signal('');

  // UI state
  isLoading = signal(false);
  error = signal<string | null>(null);
  successInfo = signal<{ tempPassword: string } | null>(null);
  copied = signal(false);

  get isEditMode(): boolean {
    return !!this.user;
  }

  get formTitle(): string {
    return this.isEditMode ? 'Edit User' : 'Invite Airline Operator';
  }

  ngOnInit(): void {
    if (this.user) {
      this.email.set(this.user.email);
      this.firstName.set(this.user.firstName);
      this.lastName.set(this.user.lastName);
    }
  }

  async onSubmit(): Promise<void> {
    this.error.set(null);
    this.successInfo.set(null);

    if (!this.email()) {
      this.error.set('Email is required');
      return;
    }

    if (!this.isEditMode) {
      if (!this.companyName()) {
        this.error.set('Company name is required');
        return;
      }
      if (!this.airlineCode() || this.airlineCode().length < 2 || this.airlineCode().length > 3) {
        this.error.set('Airline code must be 2-3 characters');
        return;
      }
    }

    this.isLoading.set(true);

    try {
      if (this.isEditMode && this.user) {
        // Edit mode - not supported by backend yet
        this.error.set('Edit functionality not available');
      } else {
        // Create mode - invite airline
        const response = await this.adminService.inviteAirline({
          email: this.email(),
          companyName: this.companyName(),
          airlineCode: this.airlineCode().toUpperCase(),
          firstName: this.firstName() || undefined,
          lastName: this.lastName() || undefined
        });

        this.successInfo.set({ tempPassword: response.temporaryPassword });
      }
    } catch (err: any) {
      this.error.set(err.message || 'An error occurred');
    } finally {
      this.isLoading.set(false);
    }
  }

  onDone(): void {
    this.save.emit();
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onBackdropClick(event: MouseEvent): void {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.onCancel();
    }
  }

  async copyPassword(): Promise<void> {
    const pw = this.successInfo()?.tempPassword;
    if (pw) {
      try {
        await navigator.clipboard.writeText(pw);
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      } catch {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = pw;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        this.copied.set(true);
        setTimeout(() => this.copied.set(false), 2000);
      }
    }
  }
}
