import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AccountsService } from "../accounts/accounts.service";
import { CategoriesService } from "../categories/categories.service";
import { AuditLogService } from "../../shared/application/audit-log.service";
import { EventBusService } from "../../shared/application/event-bus.service";
import { Transaction } from "../../shared/domain/models";
import { InMemoryDatabase } from "../../shared/infrastructure/in-memory-database";
import { CreateTransactionDto, UpdateTransactionDto } from "./dto";

@Injectable()
export class TransactionsService {
  constructor(
    private readonly database: InMemoryDatabase,
    private readonly accounts: AccountsService,
    private readonly categories: CategoriesService,
    private readonly audit: AuditLogService,
    private readonly events: EventBusService
  ) {}

  list(userId: string, accountId?: string) {
    return this.database
      .getVisibleTransactions(userId)
      .filter((transaction) => !accountId || transaction.accountId === accountId)
      .sort((a, b) => b.date.localeCompare(a.date) || b.createdAt.localeCompare(a.createdAt))
      .map((transaction) => this.withCategory(transaction));
  }

  create(userId: string, dto: CreateTransactionDto) {
    this.validateAmount(dto.amount);
    this.accounts.requireAccount(userId, dto.accountId);
    this.categories.requireCategory(userId, dto.categoryId, dto.type);

    const now = this.database.now();
    const transaction: Transaction = {
      id: this.database.newId(),
      userId,
      accountId: dto.accountId,
      type: dto.type,
      amount: Number(dto.amount),
      categoryId: dto.categoryId,
      description: dto.description?.trim() || "Transaction",
      date: this.normalizeDate(dto.date),
      deletedAt: null,
      createdAt: now,
      updatedAt: now
    };

    this.database.transactions.set(transaction.id, transaction);
    this.audit.record(userId, "TRANSACTION_CREATED", "Transaction", transaction.id, { amount: transaction.amount, type: transaction.type });
    this.events.publish("TransactionCreated", { transactionId: transaction.id, accountId: transaction.accountId, userId });
    return this.withCategory(transaction);
  }

  createInternal(userId: string, payload: Omit<CreateTransactionDto, "categoryId"> & { categoryId: string; transferId?: string; cardId?: string; installmentCount?: number; currentInstallment?: number }) {
    const created = this.create(userId, payload);
    const transaction = this.database.transactions.get(created.id);
    if (transaction) {
      transaction.transferId = payload.transferId;
      transaction.cardId = payload.cardId;
      transaction.installmentCount = payload.installmentCount;
      transaction.currentInstallment = payload.currentInstallment;
      this.database.transactions.set(transaction.id, transaction);
      return this.withCategory(transaction);
    }
    return created;
  }

  update(userId: string, transactionId: string, dto: UpdateTransactionDto) {
    const transaction = this.requireTransaction(userId, transactionId);
    if (transaction.transferId) {
      throw new BadRequestException("Transfer transactions cannot be edited directly");
    }

    const nextType = dto.type ?? transaction.type;
    const nextAccountId = dto.accountId ?? transaction.accountId;
    const nextCategoryId = dto.categoryId ?? transaction.categoryId;

    this.accounts.requireAccount(userId, nextAccountId);
    this.categories.requireCategory(userId, nextCategoryId, nextType);
    if (dto.amount !== undefined) {
      this.validateAmount(dto.amount);
    }

    const updated: Transaction = {
      ...transaction,
      accountId: nextAccountId,
      type: nextType,
      amount: dto.amount !== undefined ? Number(dto.amount) : transaction.amount,
      categoryId: nextCategoryId,
      description: dto.description?.trim() || transaction.description,
      date: dto.date ? this.normalizeDate(dto.date) : transaction.date,
      updatedAt: this.database.now()
    };

    this.database.transactions.set(transaction.id, updated);
    this.audit.record(userId, "TRANSACTION_UPDATED", "Transaction", transaction.id);
    this.events.publish("TransactionUpdated", { transactionId: transaction.id, accountId: updated.accountId, userId });
    return this.withCategory(updated);
  }

  softDelete(userId: string, transactionId: string) {
    const transaction = this.requireTransaction(userId, transactionId);
    if (transaction.transferId) {
      throw new BadRequestException("Transfer transactions cannot be deleted directly");
    }

    const updated = { ...transaction, deletedAt: this.database.now(), updatedAt: this.database.now() };
    this.database.transactions.set(transaction.id, updated);
    this.audit.record(userId, "TRANSACTION_DELETED", "Transaction", transaction.id);
    this.events.publish("TransactionDeleted", { transactionId: transaction.id, accountId: transaction.accountId, userId });
    return { deleted: true };
  }

  requireTransaction(userId: string, transactionId: string) {
    const transaction = this.database.transactions.get(transactionId);
    if (!transaction || transaction.userId !== userId || transaction.deletedAt) {
      throw new NotFoundException("Transaction not found");
    }
    return transaction;
  }

  private validateAmount(amount: number) {
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      throw new BadRequestException("Amount must be greater than zero");
    }
  }

  private normalizeDate(value: string) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      throw new BadRequestException("Invalid transaction date");
    }
    return date.toISOString();
  }

  private withCategory(transaction: Transaction) {
    return {
      ...transaction,
      category: this.database.categories.get(transaction.categoryId) ?? null
    };
  }
}

