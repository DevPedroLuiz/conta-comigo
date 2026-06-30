import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthenticatedUser } from "../../shared/domain/models";
import { CurrentUser } from "../../shared/presentation/current-user.decorator";
import { JwtAuthGuard } from "../../shared/presentation/jwt-auth.guard";
import { CardsService } from "./cards.service";
import { CreateCardDto, CreateCardTransactionDto } from "./dto";

@ApiTags("Cards")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("cards")
export class CardsController {
  constructor(private readonly cards: CardsService) {}

  @Get()
  list(@CurrentUser() user: AuthenticatedUser) {
    return this.cards.list(user.id);
  }

  @Post()
  create(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCardDto) {
    return this.cards.create(user.id, dto);
  }

  @Post("transactions")
  createTransaction(@CurrentUser() user: AuthenticatedUser, @Body() dto: CreateCardTransactionDto) {
    return this.cards.createTransaction(user.id, dto);
  }
}

