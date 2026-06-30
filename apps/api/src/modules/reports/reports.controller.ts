import { Controller, Get, Query, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthenticatedUser } from "../../shared/domain/models";
import { CurrentUser } from "../../shared/presentation/current-user.decorator";
import { JwtAuthGuard } from "../../shared/presentation/jwt-auth.guard";
import { ReportsService } from "./reports.service";

@ApiTags("Reports")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller("reports")
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get("summary")
  summary(@CurrentUser() user: AuthenticatedUser) {
    return this.reports.summary(user.id);
  }

  @Get("cashflow")
  cashflow(@CurrentUser() user: AuthenticatedUser, @Query("from") from?: string, @Query("to") to?: string) {
    return this.reports.cashflow(user.id, from, to);
  }
}

