import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AuditLogService } from "../../shared/application/audit-log.service";
import { Account } from "../../shared/domain/models";
import { InMemoryDatabase } from "../../shared/infrastructure/in-memory-database";
import { CreateAccountDto, UpdateAccountDto } from "./dto";

@Injectable()
export class AccountsService {
  constructor(
    private readonly database: InMemoryDatabase,
    private readonly audit: AuditLogService
  ) {}

  list(userId: string) {
    return [...this.database.accounts.values()]
      .filter((account) => account.userId === userId)
      .map((account) => this.withBalance(account));
  }

  get(userId: string, accountId: string) {
    return this.withBalance(this.requireAccount(userId, accountId));
  }

  create(userId: string, dto: CreateAccountDto) {
    if (!dto.name?.trim()) {
      throw new BadRequestException("Account name is required");
    }

    const now = this.database.now();
    const account: Account = {
      id: this.database.newId(),
      userId,
      name: dto.name.trim(),
      type: dto.type,
      createdAt: now,
      updatedAt: now
    };
    this.database.accounts.set(account.id, account);
    this.audit.record(userId, "ACCOUNT_CREATED", "Account", account.id);
    return this.withBalance(account);
  }

  update(userId: string, accountId: string, dto: UpdateAccountDto) {
    const account = this.requireAccount(userId, accountId);
    const updated = {
      ...account,
      name: dto.name?.trim() || account.name,
      type: dto.type ?? account.type,
      updatedAt: this.database.now()
    };
    this.database.accounts.set(account.id, updated);
    this.audit.record(userId, "ACCOUNT_UPDATED", "Account", account.id);
    return this.withBalance(updated);
  }

  requireAccount(userId: string, accountId: string) {
    const account = this.database.accounts.get(accountId);
    if (!account || account.userId !== userId) {
      throw new NotFoundException("Account not found");
    }
    return account;
  }

  private withBalance(account: Account) {
    return {
      ...account,
      balance: this.database.getAccountBalance(account.id)
    };
  }
}

