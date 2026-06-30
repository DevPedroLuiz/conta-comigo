import { Injectable } from "@nestjs/common";
import { InMemoryDatabase } from "../../shared/infrastructure/in-memory-database";

@Injectable()
export class ReportsService {
  constructor(private readonly database: InMemoryDatabase) {}

  summary(userId: string) {
    const transactions = this.database.getVisibleTransactions(userId);
    const income = transactions.filter((transaction) => transaction.type === "income").reduce((sum, transaction) => sum + transaction.amount, 0);
    const expense = transactions.filter((transaction) => transaction.type === "expense").reduce((sum, transaction) => sum + transaction.amount, 0);
    const accounts = [...this.database.accounts.values()].filter((account) => account.userId === userId);
    const totalBalance = accounts.reduce((sum, account) => sum + this.database.getAccountBalance(account.id), 0);
    const categories = new Map<string, { categoryId: string; categoryName: string; type: string; total: number }>();

    for (const transaction of transactions) {
      const category = this.database.categories.get(transaction.categoryId);
      const key = `${transaction.type}:${transaction.categoryId}`;
      const current = categories.get(key) ?? {
        categoryId: transaction.categoryId,
        categoryName: category?.name ?? "Uncategorized",
        type: transaction.type,
        total: 0
      };
      current.total += transaction.amount;
      categories.set(key, current);
    }

    return {
      totalBalance,
      income,
      expense,
      net: income - expense,
      accounts: accounts.length,
      transactions: transactions.length,
      byCategory: [...categories.values()].sort((a, b) => b.total - a.total)
    };
  }

  cashflow(userId: string, from?: string, to?: string) {
    const fromTime = from ? new Date(from).getTime() : Number.NEGATIVE_INFINITY;
    const toTime = to ? new Date(to).getTime() : Number.POSITIVE_INFINITY;
    const buckets = new Map<string, { period: string; income: number; expense: number; net: number }>();

    for (const transaction of this.database.getVisibleTransactions(userId)) {
      const time = new Date(transaction.date).getTime();
      if (time < fromTime || time > toTime) {
        continue;
      }
      const period = transaction.date.slice(0, 7);
      const bucket = buckets.get(period) ?? { period, income: 0, expense: 0, net: 0 };
      if (transaction.type === "income") {
        bucket.income += transaction.amount;
      } else {
        bucket.expense += transaction.amount;
      }
      bucket.net = bucket.income - bucket.expense;
      buckets.set(period, bucket);
    }

    return [...buckets.values()].sort((a, b) => a.period.localeCompare(b.period));
  }
}

