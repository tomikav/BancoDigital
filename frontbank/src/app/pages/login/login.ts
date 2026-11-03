import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { getApiError } from '../../core/api-error';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './auth.scss',
})
export class Login {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  auth = inject(AuthService);

  expired = this.route.snapshot.queryParamMap.get('expired');
  registered = this.route.snapshot.queryParamMap.get('registered');

  loading = signal(false);
  error = signal('');

  form = this.fb.group({
    user: ['', Validators.required],
    password: ['', Validators.required],
  });

  onMockChange(event: Event) {
    const checked = (event.target as HTMLInputElement).checked;
    this.auth.setMockMode(checked);
    if (checked) {
      this.form.setValue({ user: 'demo', password: 'demo1234' });
    }
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.error.set('');

    const user = this.form.value.user!.trim();
    const password = this.form.value.password!;

    this.auth.login(user, password).subscribe({
      next: () => this.router.navigate(['/app']),
      error: (err) => {
        this.error.set(getApiError(err).message);
        this.loading.set(false);
      },
    });
  }
}
