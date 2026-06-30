import { Injectable } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import { Account, AuditLog, Card, Category, RefreshToken, Transaction, Transfer, User } from "../domain/models";

@Injectable()
export class InMemoryDatabase {
  readonly users = new Map<string, User>();
  readonly refreshTokens = new Map<string, RefreshToken>();
  readonly accounts = new Map<string, Account>();
  readonly categories = new Map<string, Category>();
  readonly transactions = new Map<string, Transaction>();
  readonly transfers = new Map<string, Transfer>();
  readonly cards = new Map<string, Card>();
  readonly auditLogs = new Map<string, AuditLog>();

  constructor() {
    this.seedSystemCategories();
  }

  newId() {
    return randomUUID();
  }

  now() {
    return new Date().toISOString();
  }

  getVisibleTransactions(userId: string) {
    return [...this.transactions.values()].filter((transaction) => transaction.userId === userId && !transaction.deletedAt);
  }

  getAccountBalance(accountId: string) {
    return [...this.transactions.values()]
      .filter((transaction) => transaction.accountId === accountId && !transaction.deletedAt)
      .reduce((balance, transaction) => {
        return balance + (transaction.type === "income" ? transaction.amount : -transaction.amount);
      }, 0);
  }

  private seedSystemCategories() {
    const defaults: Array<Pick<Category, "name" | "type">> = [
      { name: "Salary", type: "income" },
      { name: "Sales", type: "income" },
      { name: "Investment return", type: "income" },
      { name: "Food", type: "expense" },
      { name: "Transport", type: "expense" },
      { name: "Housing", type: "expense" },
      { name: "Health", type: "expense" },
      { name: "Transfer", type: "expense" }
    ];

    for (const category of defaults) {
      const id = this.newId();
      this.categories.set(id, {
        id,
        userId: null,
        name: category.name,
        type: category.type,
        isSystem: true
      });
    }
  }
}

