import { Module } from '@nestjs/common';
import { TelegrafModule } from 'nestjs-telegraf';
import { session } from 'telegraf';
import { TgMessage } from './message';

@Module({
  imports: [
    TelegrafModule.forRoot({
      token: "8130604725:AAEDXXfP10MoI6M9VJQFtonZvKJFvDgpj8k",
      middlewares: [session()],
    }),
  ],
  providers: [TgMessage]
})
export class BotModule {}