import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import {
  BalanceResponse,
  MessageResponse,
  RegisterRequest,
  RegisterResponse,
  TransactionResponse,
  UpdatePersonalDataRequest,
  UserProfile,
  WithdrawalResponse,
} from './models';

@Injectable({ providedIn: 'root' })
export class BankApiService {
  private http = inject(HttpClient);
  private url = '/api';

  balance = signal<number | null>(null);

  register(data: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(this.url + '/users/register', data);
  }

  getBalance(): Observable<BalanceResponse> {
    return this.http
      .get<BalanceResponse>(this.url + '/accounts/me/balance')
      .pipe(tap((res) => this.balance.set(res.balance)));
  }

  deposit(amount: number): Observable<TransactionResponse> {
    return this.http
      .post<TransactionResponse>(this.url + '/accounts/me/deposits', { amount })
      .pipe(tap((res) => this.balance.set(res.balanceAfter)));
  }

  withdraw(amount: number, pin: string): Observable<WithdrawalResponse> {
    return this.http
      .post<WithdrawalResponse>(this.url + '/accounts/me/withdrawals', { amount, pin })
      .pipe(tap((res) => this.balance.set(res.balanceAfter)));
  }

  updatePersonalData(data: UpdatePersonalDataRequest): Observable<UserProfile> {
    return this.http.patch<UserProfile>(this.url + '/users/me', data);
  }

  changePassword(currentPassword: string, newPassword: string): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(this.url + '/users/me/password', { currentPassword, newPassword });
  }

  setPin(newPin: string, currentPin: string | null): Observable<MessageResponse> {
    return this.http.put<MessageResponse>(this.url + '/users/me/pin', { currentPin, newPin });
  }
}
