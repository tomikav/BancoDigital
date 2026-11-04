import { HttpErrorResponse, HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { delay, of, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { BillBundle, DAILY_LIMIT, DENOMINATIONS, MIN_WITHDRAWAL } from './models';

interface MockUser {
  userId: number;
  user: string;
  password: string;
  name: string;
  lastName: string;
  birthDate: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  pin: string | null;
  balance: number;
  withdrawals: { amount: number; date: string }[];
}

function getUsers(): MockUser[] {
  const data = localStorage.getItem('mockUsers');
  if (data) {
    return JSON.parse(data);
  }
  const users: MockUser[] = [
    {
      userId: 1,
      user: 'demo',
      password: 'demo1234',
      name: 'Usuario',
      lastName: 'Demo',
      birthDate: '2000-01-01',
      email: 'demo@banco.co',
      phone: '3001234567',
      address: 'Calle 1 # 2-3',
      pin: '1234',
      balance: 500000,
      withdrawals: [],
    },
  ];
  saveUsers(users);
  return users;
}

function saveUsers(users: MockUser[]) {
  localStorage.setItem('mockUsers', JSON.stringify(users));
}

function ok(body: any, status = 200) {
  return of(new HttpResponse({ status, body })).pipe(delay(300));
}

function fail(status: number, code: string, message: string, fieldErrors?: any) {
  return throwError(() => new HttpErrorResponse({ status, error: { code, message, fieldErrors } })).pipe(delay(300));
}

function toProfile(u: MockUser) {
  return {
    userId: u.userId,
    user: u.user,
    name: u.name,
    lastName: u.lastName,
    birthDate: u.birthDate,
    email: u.email,
    phone: u.phone,
    address: u.address,
  };
}

function today(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: 'America/Bogota' });
}

function calculateBills(amount: number): BillBundle[] | null {
  let rest = amount;
  const bills: BillBundle[] = [];
  for (const d of DENOMINATIONS) {
    const quantity = Math.floor(rest / d);
    if (quantity > 0) {
      bills.push({ denomination: d, quantity });
      rest = rest - quantity * d;
    }
  }
  return rest === 0 ? bills : null;
}

function money(n: number): string {
  return '$' + n.toLocaleString('es-CO');
}

export const mockBackendInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  if (!auth.mockMode() || !req.url.startsWith('/api')) {
    return next(req);
  }

  const users = getUsers();
  const path = req.url.replace('/api', '');
  const body: any = req.body || {};

  if (req.method === 'POST' && path === '/users/register') {
    if (!body.user || !body.password || body.password.length < 8 || !body.name || !body.lastName || !body.birthDate) {
      return fail(400, 'VALIDATION_ERROR', 'Datos inválidos', { password: 'debe tener mínimo 8 caracteres' });
    }
    if (users.find((u) => u.user === body.user)) {
      return fail(409, 'USERNAME_ALREADY_EXISTS', 'El usuario ' + body.user + ' ya existe');
    }
    const newUser: MockUser = {
      userId: users.length + 1,
      user: body.user,
      password: body.password,
      name: body.name,
      lastName: body.lastName,
      birthDate: body.birthDate,
      email: null,
      phone: null,
      address: null,
      pin: null,
      balance: 0,
      withdrawals: [],
    };
    users.push(newUser);
    saveUsers(users);
    return ok({ userId: newUser.userId, user: newUser.user }, 201);
  }

  const header = req.headers.get('Authorization') || '';
  const [username, password] = atob(header.replace('Basic ', '')).split(':');
  const user = users.find((u) => u.user === username && u.password === password);
  if (!user) {
    return throwError(() => new HttpErrorResponse({ status: 401 })).pipe(delay(300));
  }

  if (req.method === 'POST' && path === '/auth/login') {
    return ok(toProfile(user));
  }

  if (req.method === 'GET' && path === '/accounts/me/balance') {
    return ok({ accountId: user.userId, balance: user.balance, currency: 'COP', consultedAt: new Date().toISOString() });
  }

  if (req.method === 'POST' && path === '/accounts/me/deposits') {
    const amount = Number(body.amount);
    if (!amount || amount <= 0) {
      return fail(400, 'VALIDATION_ERROR', 'Datos inválidos', { amount: 'debe ser mayor que 0' });
    }
    user.balance = user.balance + amount;
    saveUsers(users);
    return ok({
      transactionId: Date.now(),
      type: 'DEPOSIT',
      amount,
      balanceAfter: user.balance,
      currency: 'COP',
      createdAt: new Date().toISOString(),
      message: 'Depósito procesado correctamente',
    });
  }

  if (req.method === 'POST' && path === '/accounts/me/withdrawals') {
    const amount = Number(body.amount);
    if (!/^\d{4}$/.test(body.pin || '')) {
      return fail(400, 'VALIDATION_ERROR', 'Datos inválidos', { pin: 'el PIN debe tener exactamente 4 dígitos' });
    }
    if (!user.pin) {
      return fail(409, 'PIN_NOT_ACTIVATED', 'Aún no has activado tu PIN de seguridad');
    }
    if (user.pin !== body.pin) {
      return fail(403, 'INVALID_PIN', 'El PIN de seguridad es incorrecto');
    }
    if (amount < MIN_WITHDRAWAL) {
      return fail(422, 'AMOUNT_BELOW_MINIMUM', 'El monto mínimo de retiro es ' + money(MIN_WITHDRAWAL));
    }
    const bills = calculateBills(amount);
    if (!bills) {
      return fail(422, 'AMOUNT_NOT_DISPENSABLE', 'El monto ' + money(amount) + ' no se puede entregar con los billetes disponibles');
    }
    if (user.balance < amount) {
      return fail(422, 'INSUFFICIENT_FUNDS', 'Saldo insuficiente, tienes ' + money(user.balance));
    }
    let withdrawnToday = 0;
    for (const w of user.withdrawals) {
      if (w.date === today()) {
        withdrawnToday = withdrawnToday + w.amount;
      }
    }
    if (withdrawnToday + amount > DAILY_LIMIT) {
      return fail(422, 'DAILY_LIMIT_EXCEEDED', 'Superas el tope diario de ' + money(DAILY_LIMIT) + ' (hoy llevas ' + money(withdrawnToday) + ')');
    }
    user.balance = user.balance - amount;
    user.withdrawals.push({ amount, date: today() });
    saveUsers(users);
    let totalBills = 0;
    for (const b of bills) {
      totalBills = totalBills + b.quantity;
    }
    return ok({
      transactionId: Date.now(),
      amount,
      balanceAfter: user.balance,
      currency: 'COP',
      bills,
      totalBills,
      withdrawnToday: withdrawnToday + amount,
      createdAt: new Date().toISOString(),
      message: 'Retiro procesado correctamente',
    });
  }

  if (req.method === 'PATCH' && path === '/users/me') {
    const errors: any = {};
    if (body.email && !/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test(body.email)) {
      errors.email = 'debe tener un formato de correo válido';
    }
    if (body.phone && !/^\d{10}$/.test(body.phone)) {
      errors.phone = 'debe tener exactamente 10 dígitos';
    }
    if (Object.keys(errors).length > 0) {
      return fail(400, 'VALIDATION_ERROR', 'Datos inválidos', errors);
    }
    if (body.email) user.email = body.email;
    if (body.phone) user.phone = body.phone;
    if (body.address) user.address = body.address;
    saveUsers(users);
    return ok(toProfile(user));
  }

  if (req.method === 'PUT' && path === '/users/me/password') {
    if (body.currentPassword !== user.password) {
      return fail(400, 'INVALID_CURRENT_CREDENTIAL', 'La clave actual no es correcta');
    }
    user.password = body.newPassword;
    saveUsers(users);
    return ok({ message: 'Clave de acceso actualizada correctamente' });
  }

  if (req.method === 'PUT' && path === '/users/me/pin') {
    if (user.pin && body.currentPin !== user.pin) {
      return fail(400, 'INVALID_CURRENT_CREDENTIAL', 'El PIN actual no es correcto');
    }
    user.pin = body.newPin;
    saveUsers(users);
    return ok({ message: 'PIN de seguridad actualizado correctamente' });
  }

  return fail(404, 'NOT_FOUND', 'Ruta no encontrada');
};
