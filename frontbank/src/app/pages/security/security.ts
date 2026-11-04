import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth.service';
import { BankApiService } from '../../core/bank-api.service';
import { cleanMessage, getApiError } from '../../core/api-error';

@Component({
  selector: 'app-security',
  imports: [ReactiveFormsModule],
  templateUrl: './security.html',
})
export class Security {
  private fb = inject(FormBuilder);
  private api = inject(BankApiService);
  private auth = inject(AuthService);

  passwordForm = this.fb.group({
    currentPassword: ['', Validators.required],
    newPassword: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
    confirm: ['', Validators.required],
  });
  passwordLoading = signal(false);
  passwordOk = signal('');
  passwordError = signal('');

  pinForm = this.fb.group({
    currentPin: [''],
    newPin: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
    confirm: ['', Validators.required],
  });
  pinLoading = signal(false);
  pinOk = signal('');
  pinError = signal('');
  firstPin = signal(true);

  onFirstPinChange(event: Event) {
    this.firstPin.set((event.target as HTMLInputElement).checked);
  }

  changePassword() {
    this.passwordOk.set('');
    this.passwordError.set('');

    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      this.passwordError.set('Completa los campos. La nueva contraseña debe tener mínimo 8 caracteres.');
      return;
    }
    const { currentPassword, newPassword, confirm } = this.passwordForm.value;
    if (newPassword !== confirm) {
      this.passwordError.set('Las contraseñas no coinciden.');
      return;
    }

    this.passwordLoading.set(true);
    this.api.changePassword(currentPassword!, newPassword!).subscribe({
      next: (res) => {
        this.auth.updatePassword(newPassword!);
        this.passwordForm.reset();
        this.passwordOk.set(cleanMessage(res.message));
        this.passwordLoading.set(false);
      },
      error: (err) => {
        this.passwordError.set(cleanMessage(getApiError(err).message));
        this.passwordLoading.set(false);
      },
    });
  }

  changePin() {
    this.pinOk.set('');
    this.pinError.set('');

    if (this.pinForm.invalid) {
      this.pinForm.markAllAsTouched();
      this.pinError.set('El PIN debe tener exactamente 4 dígitos.');
      return;
    }
    const { currentPin, newPin, confirm } = this.pinForm.value;
    if (newPin !== confirm) {
      this.pinError.set('Los PIN no coinciden.');
      return;
    }
    if (!this.firstPin() && !/^\d{4}$/.test(currentPin || '')) {
      this.pinError.set('Ingresa tu PIN actual de 4 dígitos.');
      return;
    }

    this.pinLoading.set(true);
    const current = this.firstPin() ? null : currentPin!;
    this.api.setPin(newPin!, current).subscribe({
      next: (res) => {
        this.pinForm.reset();
        this.firstPin.set(false);
        this.pinOk.set(cleanMessage(res.message));
        this.pinLoading.set(false);
      },
      error: (err) => {
        const apiError = getApiError(err);
        if (apiError.code === 'INVALID_CURRENT_CREDENTIAL' && this.firstPin()) {
          this.firstPin.set(false);
          this.pinError.set('Ya tienes un PIN activo. Ingresa tu PIN actual para cambiarlo.');
        } else {
          this.pinError.set(cleanMessage(apiError.message));
        }
        this.pinLoading.set(false);
      },
    });
  }
}
