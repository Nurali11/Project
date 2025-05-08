import { Module } from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { WithdrawController } from './withdraw.controller';

@Module({
  controllers: [WithdrawController],
  providers: [WithdrawService],
})
export class WithdrawModule {}
