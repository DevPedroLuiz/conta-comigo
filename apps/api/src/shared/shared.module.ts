import { Global, Module } from "@nestjs/common";
import { AuditLogService } from "./application/audit-log.service";
import { EventBusService } from "./application/event-bus.service";
import { InMemoryDatabase } from "./infrastructure/in-memory-database";

@Global()
@Module({
  providers: [InMemoryDatabase, EventBusService, AuditLogService],
  exports: [InMemoryDatabase, EventBusService, AuditLogService]
})
export class SharedModule {}

