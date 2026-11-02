export interface UserProfile {
  userId: number;
  user: string;
  name: string;
  lastName: string;
  birthDate: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface RegisterRequest {
  user: string;
  password: string;
  name: string;
  lastName: string;
  birthDate: string;
}

export interface RegisterResponse {
  userId: number;
  user: string;
}

export interface BalanceResponse {
  accountId: number;
  balance: number;
  currency: string;
  consultedAt: string;
}

export interface TransactionResponse {
  transactionId: number;
  type: string;
  amount: number;
  balanceAfter: number;
  currency: string;
  createdAt: string;
  message: string;
}

export interface BillBundle {
  denomination: number;
  quantity: number;
}

export interface WithdrawalResponse {
  transactionId: number;
  amount: number;
  balanceAfter: number;
  currency: string;
  bills: BillBundle[];
  totalBills: number;
  withdrawnToday: number;
  createdAt: string;
  message: string;
}

export interface UpdatePersonalDataRequest {
  email?: string;
  phone?: string;
  address?: string;
}

export interface MessageResponse {
  message: string;
}

export interface ApiError {
  code: string;
  message: string;
  fieldErrors?: { [field: string]: string };
}

export const MIN_WITHDRAWAL = 10000;
export const DAILY_LIMIT = 1000000;
export const DENOMINATIONS = [100000, 50000, 20000, 10000];
