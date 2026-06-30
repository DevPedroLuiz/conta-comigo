export type UserKind = "person" | "company";
export type AccountType = "checking" | "savings" | "investment";
export type TransactionType = "income" | "expense";

export interface User {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  kind: UserKind;
  createdAt: string;
  updatedAt: string;
}

export interface RefreshToken {
  token: string;
  userId: string;
  expiresAt: string;
}

export interface Account {
  id: string;
  userId: string;
  name: string;
  type: AccountType;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  userId: string | null;
  name: string;
  type: TransactionType;
  isSystem: boolean;
}

export interface Transaction {
  id: string;
  accountId: string;
  userId: string;
  type: TransactionType;
  amount: number;
  categoryId: string;
  description: string;
  date: string;
  transferId?: string;
  cardId?: string;
  installmentCount?: number;
  currentInstallment?: number;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transfer {
  id: string;
  userId: string;
  fromAccountId: string;
  toAccountId: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface Card {
  id: string;
  userId: string;
  name: string;
  limit: number;
  closingDay: number;
  dueDay: number;
  createdAt: string;
  updatedAt: string;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export interface AuthenticatedUser {
  id: string;
  email: string;
}

