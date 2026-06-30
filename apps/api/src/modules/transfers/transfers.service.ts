import { BadRequestException, Injectable } from "@nestjs/common";
import { AccountsService } from "../accounts/accounts.service";
import { CategoriesService } from "../categories/categories.service";
import { TransactionsService } from "../transactions/transactions.service";
import { AuditLogService } from "../../shared/application/audit-log.service";
import { EventBusService } from "../../shared/application/event-bus.service";
import { Transfer } from "../../shared/domain/models";
import { InMemoryDatabase } from "../../shared/infrastructure/in-memory-database";
import { CreateTransferDto } from "./dto";

@Injectable()
export class TransfersService {
  constructor(
    private readonly database: InMemoryDatabase,
    private readonly accounts: AccountsService,
    private readonly categories: CategoriesService,
    private readonly transactions: TransactionsService,
    private readonly audit: AuditLogService,
    private readonly events: EventBusService
  ) {}

  create(userId: string, dto: CreateTransferDto) {
    if (dto.fromAccountId === dto.toAccountId) {
      throw new BadRequestException("Transfer accounts must be different");
    }
    if (!Number.isFinite(Number(dto.amount)) || Number(dto.amount) <= 0) {
      throw new BadRequestException("Amount must be greater than zero");
    }

    const from = this.accounts.requireAccount(userId, dto.fromAccountId);
    this.accounts.requireAccount(userId, dto.toAccountId);
    const balance = this.database.getAccountBalance(from.id);
    if (balance < Number(dto.amount)) {
      throw new BadRequestException("Insufficient balance for transfer");
    }

    const expenseCategory = this.categories.getTransferCategory("expense") ?? this.categories.create(userId, { name: "Transfer sent", type: "expense" });
    const incomeCategory = this.categories.getTransferCategory("income") ?? this.categories.create(userId, { name: "Transfer received", type: "income" });

    const transfer: Transfer = {
      id: this.database.newId(),
      userId,
      fromAccountId: dto.fromAccountId,
      toAccountId: dto.toAccountId,
      amount: Number(dto.amount),
      date: new Date(dto.date).toISOString(),
      createdAt: this.database.now()
    };
    this.database.transfers.set(transfer.id, transfer);

    const description = dto.description?.trim() || "Transfer";
    const debit = this.transactions.createInternal(userId, {
      accountId: dto.fromAccountId,
      type: "expense",
      amount: transfer.amount,
      categoryId: expenseCategory.id,
      description,
      date: transfer.date,
      transferId: transfer.id
    });
    const credit = this.transactions.createInternal(userId, {
      accountId: dto.toAccountId,
      type: "income",
      amount: transfer.amount,
      categoryId: incomeCategory.id,
      description,
      date: transfer.date,
      transferId: transfer.id
    });

    this.audit.record(userId, "TRANSFER_COMPLETED", "Transfer", transfer.id, { debitTransactionId: debit.id, creditTransactionId: credit.id });
    this.events.publish("TransferCompleted", { transferId: transfer.id, userId });
    return { ...transfer, debit, credit };
  }
}

