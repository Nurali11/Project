import { Module } from '@nestjs/common';
import { RestarauntService } from './restaraunt.service';
import { RestarauntController } from './restaraunt.controller';

@Module({
  controllers: [RestarauntController],
  providers: [RestarauntService],
})
export class RestarauntModule {}
