import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class CreateAccountDto {
  @ApiProperty()
  name!: string;

  @ApiProperty({ enum: ["checking", "savings", "investment"] })
  type!: "checking" | "savings" | "investment";
}

export class UpdateAccountDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ enum: ["checking", "savings", "investment"] })
  type?: "checking" | "savings" | "investment";
}

