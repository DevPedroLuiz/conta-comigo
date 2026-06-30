import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { AuditLogService } from "../../shared/application/audit-log.service";
import { Category, TransactionType } from "../../shared/domain/models";
import { InMemoryDatabase } from "../../shared/infrastructure/in-memory-database";
import { CreateCategoryDto } from "./dto";

@Injectable()
export class CategoriesService {
  constructor(
    private readonly database: InMemoryDatabase,
    private readonly audit: AuditLogService
  ) {}

  list(userId: string, type?: TransactionType) {
    return [...this.database.categories.values()].filter((category) => {
      const owned = category.isSystem || category.userId === userId;
      return owned && (!type || category.type === type);
    });
  }

  create(userId: string, dto: CreateCategoryDto) {
    if (!dto.name?.trim()) {
      throw new BadRequestException("Category name is required");
    }

    const category: Category = {
      id: this.database.newId(),
      userId,
      name: dto.name.trim(),
      type: dto.type,
      isSystem: false
    };
    this.database.categories.set(category.id, category);
    this.audit.record(userId, "CATEGORY_CREATED", "Category", category.id);
    return category;
  }

  requireCategory(userId: string, categoryId: string, type?: TransactionType) {
    const category = this.database.categories.get(categoryId);
    if (!category || (!category.isSystem && category.userId !== userId) || (type && category.type !== type)) {
      throw new NotFoundException("Category not found");
    }
    return category;
  }

  getTransferCategory(type: TransactionType) {
    return [...this.database.categories.values()].find((category) => category.isSystem && category.name === "Transfer" && category.type === type);
  }
}

