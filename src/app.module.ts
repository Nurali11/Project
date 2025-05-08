import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { RestarauntModule } from './restaraunt/restaraunt.module';
import { RegionModule } from './region/region.module';
import { CategoryNoSpecModule } from './category--no-spec/category--no-spec.module';
import { DebtModule } from './debt/debt.module';
import { WithdrawModule } from './withdraw/withdraw.module';
import { CategoryModule } from './category/category.module';
import { OrderModule } from './order/order.module';
import { ProductModule } from './product/product.module';

@Module({
  imports: [UserModule, RestarauntModule, RegionModule, CategoryNoSpecModule, DebtModule, WithdrawModule, CategoryModule, OrderModule, ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
