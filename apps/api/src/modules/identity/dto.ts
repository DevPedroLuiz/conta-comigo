import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class RegisterDto {
  @ApiProperty()
  name!: string;

  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;

  @ApiPropertyOptional({ enum: ["person", "company"] })
  kind?: "person" | "company";
}

export class LoginDto {
  @ApiProperty()
  email!: string;

  @ApiProperty()
  password!: string;
}

export class RefreshDto {
  @ApiProperty()
  refreshToken!: string;
}

export class UpdateProfileDto {
  @ApiPropertyOptional()
  name?: string;

  @ApiPropertyOptional({ enum: ["person", "company"] })
  kind?: "person" | "company";
}

