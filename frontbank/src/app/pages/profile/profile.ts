import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { BankApiService } from '../../core/bank-api.service';
import { cleanMessage, getApiError } from '../../core/api-error';
import { UpdatePersonalDataRequest } from '../../core/models';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, DatePipe],
  templateUrl: './profile.html',
})
export class Profile {
  private fb = inject(FormBuilder);
  private api = inject(BankApiService);
  auth = inject(AuthService);

  loading = signal(false);
  success = signal('');
  error = signal('');
  fieldErrors = signal<any>({});

  form = this.fb.group({
    email: [this.auth.profile()?.email || '', [Validators.email, Validators.maxLength(120)]],
    phone: [this.auth.profile()?.phone || '', [Validators.pattern(/^\d{10}$/)]],
    address: [this.auth.profile()?.address || '', [Validators.maxLength(150)]],
  });

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return (control!.touched && control!.invalid) || !!this.fieldErrors()[field];
  }

  submit() {
    this.success.set('');
    this.error.set('');
    this.fieldErrors.set({});

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set('Revisa los campos marcados en rojo.');
      return;
    }

    const profile = this.auth.profile();
    const email = this.form.value.email!.trim();
    const phone = this.form.value.phone!.trim();
    const address = this.form.value.address!.trim();

    const data: UpdatePersonalDataRequest = {};
    if (email && email !== profile?.email) data.email = email;
    if (phone && phone !== profile?.phone) data.phone = phone;
    if (address && address !== profile?.address) data.address = address;

    if (Object.keys(data).length === 0) {
      this.error.set('No hay cambios para guardar.');
      return;
    }

    this.loading.set(true);
    this.api.updatePersonalData(data).subscribe({
      next: (res) => {
        this.auth.saveProfile(res);
        this.success.set('Tus datos se actualizaron correctamente.');
        this.loading.set(false);
      },
      error: (err) => {
        const apiError = getApiError(err);
        this.fieldErrors.set(apiError.fieldErrors || {});
        this.error.set(apiError.fieldErrors ? 'Revisa los campos marcados en rojo.' : cleanMessage(apiError.message));
        this.loading.set(false);
      },
    });
  }
}
