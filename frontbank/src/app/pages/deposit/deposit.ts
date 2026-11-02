import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { BankApiService } from '../../core/bank-api.service';
import { CopPipe } from '../../core/cop.pipe';
import { cleanMessage, getApiError } from '../../core/api-error';
import { TransactionResponse } from '../../core/models';

@Component({
  selector: 'app-deposit',
  imports: [ReactiveFormsModule, CopPipe, DatePipe],
  templateUrl: './deposit.html',
})
export class Deposit {
  api = inject(BankApiService);

  quickAmounts = [50000, 100000, 200000, 500000];
  amount = new FormControl<number | null>(null);
  form = new FormGroup({ amount: this.amount });

  loading = signal(false);
  error = signal('');
  receipt = signal<TransactionResponse | null>(null);

  submit() {
    const value = Number(this.amount.value);
    if (!value || value <= 0) {
      this.error.set('Ingresa un monto mayor a $0 para depositar.');
      return;
    }
    this.loading.set(true);
    this.error.set('');
    this.receipt.set(null);

    this.api.deposit(value).subscribe({
      next: (res) => {
        this.receipt.set(res);
        this.amount.reset();
        this.loading.set(false);
      },
      error: (err) => {
        this.error.set(cleanMessage(getApiError(err).message));
        this.loading.set(false);
      },
    });
  }

  clean(msg: string) {
    return cleanMessage(msg);
  }
}
