import { ApiProperty } from "@nestjs/swagger";

export class CreateTransferDto {
  @ApiProperty()
  fromAccountId!: string;

  @ApiProperty()
  toAccountId!: string;

  @ApiProperty()
  amount!: number;

  @ApiProperty()
  date!: string;

  @ApiProperty()
  description!: string;
}

