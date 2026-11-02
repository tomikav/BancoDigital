import { DatePipe } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { BankApiService } from '../../core/bank-api.service';
import { CopPipe } from '../../core/cop.pipe';
import { cleanMessage, getApiError } from '../../core/api-error';
import { BillBundle, DAILY_LIMIT, DENOMINATIONS, MIN_WITHDRAWAL, WithdrawalResponse } from '../../core/models';

const ERROR_TITLES: { [code: string]: string } = {
  INVALID_PIN: 'PIN incorrecto',
  INVALID_PIN_FORMAT: 'PIN con formato inválido',
  PIN_NOT_ACTIVATED: 'PIN no activado',
  AMOUNT_BELOW_MINIMUM: 'Monto inferior al mínimo',
  AMOUNT_NOT_DISPENSABLE: 'Monto no se puede entregar en billetes',
  INSUFFICIENT_FUNDS: 'Fondos insuficientes',
  DAILY_LIMIT_EXCEEDED: 'Tope diario superado',
  VALIDATION_ERROR: 'Datos inválidos',
};

@Component({
  selector: 'app-withdraw',
  imports: [ReactiveFormsModule, CopPipe, DatePipe, RouterLink],
  templateUrl: './withdraw.html',
  styleUrl: './withdraw.scss',
})
export class Withdraw {
  private fb = inject(FormBuilder);
  api = inject(BankApiService);

  minWithdrawal = MIN_WITHDRAWAL;
  dailyLimit = DAILY_LIMIT;
  quickAmounts = [20000, 50000, 100000, 200000, 300000, 500000];

  form = this.fb.group({
    amount: [null as number | null, Validators.required],
    pin: ['', [Validators.required, Validators.pattern(/^\d{4}$/)]],
  });

  loading = signal(false);
  errorTitle = signal('');
  errorMessage = signal('');
  errorCode = signal('');
  result = signal<WithdrawalResponse | null>(null);
  withdrawnToday = signal(0);

  calculateBills(amount: number): BillBundle[] | null {
    let rest = amount;
    const bills: BillBundle[] = [];
    for (const d of DENOMINATIONS) {
      const quantity = Math.floor(rest / d);
      if (quantity > 0) {
        bills.push({ denomination: d, quantity: quantity });
        rest = rest - quantity * d;
      }
    }
    if (rest !== 0) return null;
    return bills;
  }

  preview(): BillBundle[] | null {
    const amount = Number(this.form.value.amount);
    if (!amount || amount < MIN_WITHDRAWAL) return null;
    return this.calculateBills(amount);
  }

  warning(): string {
    const value = this.form.value.amount;
    if (value === null || value === undefined) return '';
    const amount = Number(value);
    const balance = this.api.balance();

    if (amount <= 0) return 'El monto debe ser mayor a $0.';
    if (amount < MIN_WITHDRAWAL) return 'El monto mínimo de retiro es $10.000.';
    if (amount % 10000 !== 0) return 'El monto debe ser múltiplo de $10.000 para poder entregarlo en billetes.';
    if (balance !== null && amount > balance) return 'El monto supera tu saldo disponible.';
    if (this.withdrawnToday() + amount > DAILY_LIMIT) return 'Con este retiro superarías el tope diario de $1.000.000.';
    return '';
  }

  dailyPercent(): number {
    return Math.min(100, (this.withdrawnToday() / DAILY_LIMIT) * 100);
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.loading.set(true);
    this.errorTitle.set('');
    this.result.set(null);

    const amount = Number(this.form.value.amount);
    const pin = this.form.value.pin!;

    this.api.withdraw(amount, pin).subscribe({
      next: (res) => {
        this.result.set(res);
        this.withdrawnToday.set(res.withdrawnToday);
        this.form.reset();
        this.loading.set(false);
      },
      error: (err) => {
        const apiError = getApiError(err);
        let message = cleanMessage(apiError.message);
        if (apiError.fieldErrors) {
          message = Object.values(apiError.fieldErrors).join('. ');
        }
        this.errorTitle.set(ERROR_TITLES[apiError.code] || 'Transacción rechazada');
        this.errorMessage.set(message);
        this.errorCode.set(apiError.code);
        this.form.get('pin')!.reset('');
        this.loading.set(false);
      },
    });
  }

  billCopies(quantity: number): number[] {
    const copies = [];
    for (let i = 0; i < Math.min(quantity, 6); i++) {
      copies.push(i);
    }
    return copies;
  }

  clean(msg: string) {
    return cleanMessage(msg);
  }
}
