export type TransactionType = "income" | "expense";
export type AccountType = "checking" | "savings" | "investment";

export interface MoneySummary {
  totalBalance: number;
  income: number;
  expense: number;
  net: number;
}

