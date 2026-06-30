import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AccountsService } from "../accounts/accounts.service";
import { CategoriesService } from "../categories/categories.service";
import { TransactionsService } from "../transactions/transactions.service";
import { AuditLogService } from "../../shared/application/audit-log.service";
import { EventBusService } from "../../shared/application/event-bus.service";
import { Card } from "../../shared/domain/models";
import { InMemoryDatabase } from "../../shared/infrastructure/in-memory-database";
import { CreateCardDto, CreateCardTransactionDto } from "./dto";

@Injectable()
export class CardsService {
  constructor(
    private readonly database: InMemoryDatabase,
    private readonly accounts: AccountsService,
    private readonly categories: CategoriesService,
    private readonly transactions: TransactionsService,
    private readonly audit: AuditLogService,
    private readonly events: EventBusService
  ) {}

  list(userId: string) {
    return [...this.database.cards.values()]
      .filter((card) => card.userId === userId)
      .map((card) => this.withLimit(card));
  }

  create(userId: string, dto: CreateCardDto) {
    if (!dto.name?.trim()) {
      throw new BadRequestException("Card name is required");
    }
    if (!Number.isFinite(Number(dto.limit)) || Number(dto.limit) <= 0) {
      throw new BadRequestException("Card limit must be greater than zero");
    }
    if (!this.validDay(dto.closingDay) || !this.validDay(dto.dueDay)) {
      throw new BadRequestException("Closing and due days must be between 1 and 31");
    }

    const now = this.database.now();
    const card: Card = {
      id: this.database.newId(),
      userId,
      name: dto.name.trim(),
      limit: Number(dto.limit),
      closingDay: Number(dto.closingDay),
      dueDay: Number(dto.dueDay),
      createdAt: now,
      updatedAt: now
    };
    this.database.cards.set(card.id, card);
    this.audit.record(userId, "CARD_CREATED", "Card", card.id);
    return this.withLimit(card);
  }

  createTransaction(userId: string, dto: CreateCardTransactionDto) {
    const card = this.requireCard(userId, dto.cardId);
    this.accounts.requireAccount(userId, dto.accountId);
    this.categories.requireCategory(userId, dto.categoryId, "expense");

    const amount = Number(dto.amount);
    const installmentCount = Number(dto.installmentCount || 1);
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new BadRequestException("Amount must be greater than zero");
    }
    if (!Number.isInteger(installmentCount) || installmentCount < 1 || installmentCount > 48) {
      throw new BadRequestException("Installment count must be between 1 and 48");
    }
    if (this.availableLimit(card) < amount) {
      throw new BadRequestException("Insufficient card limit");
    }

    const baseDate = new Date(dto.date);
    if (Number.isNaN(baseDate.getTime())) {
      throw new BadRequestException("Invalid transaction date");
    }

    const installmentAmount = Math.round((amount / installmentCount) * 100) / 100;
    const transactions = Array.from({ length: installmentCount }).map((_, index) => {
      const date = new Date(baseDate);
      date.setMonth(baseDate.getMonth() + index);
      return this.transactions.createInternal(userId, {
        accountId: dto.accountId,
        type: "expense",
        amount: index === installmentCount - 1 ? Math.round((amount - installmentAmount * (installmentCount - 1)) * 100) / 100 : installmentAmount,
        categoryId: dto.categoryId,
        description: `${dto.description?.trim() || "Card purchase"} (${index + 1}/${installmentCount})`,
        date: date.toISOString(),
        cardId: card.id,
        installmentCount,
        currentInstallment: index + 1
      });
    });

    this.audit.record(userId, "CARD_TRANSACTION_CREATED", "Card", card.id, { amount, installmentCount });
    this.events.publish("CardTransactionCreated", { cardId: card.id, transactionIds: transactions.map((transaction) => transaction.id), userId });
    return { card: this.withLimit(card), transactions };
  }

  private requireCard(userId: string, cardId: string) {
    const card = this.database.cards.get(cardId);
    if (!card || card.userId !== userId) {
      throw new NotFoundException("Card not found");
    }
    return card;
  }

  private withLimit(card: Card) {
    return {
      ...card,
      availableLimit: this.availableLimit(card)
    };
  }

  private availableLimit(card: Card) {
    const used = this.database
      .getVisibleTransactions(card.userId)
      .filter((transaction) => transaction.cardId === card.id)
      .reduce((sum, transaction) => sum + transaction.amount, 0);
    return Math.max(0, card.limit - used);
  }

  private validDay(value: number) {
    return Number.isInteger(Number(value)) && Number(value) >= 1 && Number(value) <= 31;
  }
}

