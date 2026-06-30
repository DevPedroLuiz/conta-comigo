import { Body, Controller, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthenticatedUser } from "../../shared/domain/models";
import { CurrentUser } from "../../shared/presentation/current-user.decorator";
import { JwtAuthGuard } from "../../shared/presentation/jwt-auth.guard";
import { CreateTransferDto } from "./dto";
import { TransfersService } from "./transfers.service";

@ApiTags("Transfers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("transfers")
export class TransfersController {
  constructor(private readonly transfers: TransfersService) {}

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateTransferDto) {
    return this.transfers.create(user.id, dto);
  }
}

