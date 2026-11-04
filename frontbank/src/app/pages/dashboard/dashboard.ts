import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth.service';
import { BankApiService } from '../../core/bank-api.service';
import { CopPipe } from '../../core/cop.pipe';
import { getApiError } from '../../core/api-error';
import { BalanceResponse } from '../../core/models';

@Component({
  selector: 'app-dashboard',
  imports: [CopPipe, DatePipe, RouterLink],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {
  auth = inject(AuthService);
  api = inject(BankApiService);

  account = signal<BalanceResponse | null>(null);
  loading = signal(false);
  error = signal('');

  constructor() {
    this.loadBalance();
  }

  loadBalance() {
    this.loading.set(true);
    this.error.set('');
    this.api.getBalance().subscribe({
      next: (res) => {
        this.account.set(res);
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(getApiError(err).message);
        this.loading.set(false);
      },
    });
  }
}
