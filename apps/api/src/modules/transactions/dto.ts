import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateTransactionDto {
  @ApiProperty()
  accountId!: string;

  @ApiProperty({ enum: ["income", "expense"] })
  type!: "income" | "expense";

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  date!: string;
}

export class UpdateTransactionDto {
  @ApiPropertyOptional()
  accountId?: string;

  @ApiPropertyOptional({ enum: ["income", "expense"] })
  type?: "income" | "expense";

  @ApiPropertyOptional()
  amount?: number;

  @ApiPropertyOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  date?: string;
}

