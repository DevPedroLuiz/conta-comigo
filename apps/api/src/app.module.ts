import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { AccountsModule } from "./modules/accounts/accounts.module";
import { CardsModule } from "./modules/cards/cards.module";
import { CategoriesModule } from "./modules/categories/categories.module";
import { HealthController } from "./modules/health/health.controller";
import { IdentityModule } from "./modules/identity/identity.module";
import { ReportsModule } from "./modules/reports/reports.module";
import { TransactionsModule } from "./modules/transactions/transactions.module";
import { TransfersModule } from "./modules/transfers/transfers.module";
import { SharedModule } from "./shared/shared.module";

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET ?? "dev-secret",
      signOptions: { expiresIn: "2h" }
    }),
    SharedModule,
    IdentityModule,
    AccountsModule,
    CategoriesModule,
    TransactionsModule,
    TransfersModule,
    CardsModule,
    ReportsModule
  ],
  controllers: [HealthController]
})
export class AppModule {}
