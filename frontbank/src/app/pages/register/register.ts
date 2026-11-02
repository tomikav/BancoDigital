import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { BankApiService } from '../../core/bank-api.service';
import { cleanMessage, getApiError } from '../../core/api-error';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: '../login/auth.scss',
})
export class Register {
  private fb = inject(FormBuilder);
  private api = inject(BankApiService);
  private router = inject(Router);

  loading = signal(false);
  error = signal('');
  fieldErrors = signal<any>({});

  form = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(50)]],
    lastName: ['', [Validators.required, Validators.maxLength(50)]],
    birthDate: ['', Validators.required],
    user: ['', [Validators.required, Validators.maxLength(40)]],
    password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(72)]],
  });

  hasError(field: string): boolean {
    const control = this.form.get(field);
    return (control!.touched && control!.invalid) || !!this.fieldErrors()[field];
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.fieldErrors.set({});

    const data = {
      name: this.form.value.name!,
      lastName: this.form.value.lastName!,
      birthDate: this.form.value.birthDate!,
      user: this.form.value.user!.trim(),
      password: this.form.value.password!,
    };

    this.api.register(data).subscribe({
      next: (res) => this.router.navigate(['/login'], { queryParams: { registered: res.user } }),
      error: (err) => {
        const apiError = getApiError(err);
        this.error.set(cleanMessage(apiError.message));
        this.fieldErrors.set(apiError.fieldErrors || {});
        this.loading.set(false);
      },
    });
  }
}
