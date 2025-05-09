import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RestarauntModule } from './restaraunt/restaraunt.module';
import { RegionModule } from './region/region.module';
import { DebtModule } from './debt/debt.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { BotModule } from './bot/bot.module';

@Module({
  imports: [UserModule, RestarauntModule, RegionModule, DebtModule, WithdrawModule, CategoryModule, OrderModule, ProductModule, PrismaModule,
    JwtModule.register({
      global: true,
      secret: "sekret",
      signOptions: { expiresIn: '60s' },
    }),
    BotModule,

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
