import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'soz',
    }),
    PrismaModule,
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
