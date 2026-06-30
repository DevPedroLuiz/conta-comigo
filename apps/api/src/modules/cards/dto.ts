import { ApiProperty } from "@nestjs/swagger";

export class CreateCardDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  limit!: number;

  @ApiProperty()
  closingDay!: number;

  @ApiProperty()
  dueDay!: number;
}

export class CreateCardTransactionDto {
  @ApiProperty()
  cardId!: string;

  @ApiProperty()
  accountId!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  description!: string;

  @ApiProperty()
  installmentCount!: number;

  @ApiProperty()
  categoryId!: string;

  @ApiProperty()
  date!: string;
}

