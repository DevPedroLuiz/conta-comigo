import { Injectable } from "@nestjs/common";
import { InMemoryDatabase } from "../infrastructure/in-memory-database";

@Injectable()
export class AuditLogService {
  constructor(private readonly database: InMemoryDatabase) {}

  record(userId: string, action: string, entity: string, entityId: string, metadata: Record<string, unknown> = {}) {
    const auditLog = {
      id: this.database.newId(),
      userId,
      action,
      entity,
      entityId,
      metadata,
      createdAt: this.database.now()
    };
    this.database.auditLogs.set(auditLog.id, auditLog);
    return auditLog;
  }
}

