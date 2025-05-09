import { Module } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TelegrafModule } from 'nestjs-telegraf';
import { TgMessage } from './message';

@Module({
  imports: [TelegrafModule.forRoot({
    token: "8130604725:AAEDXXfP10MoI6M9VJQFtonZvKJFvDgpj8k"
  })],
  providers: [TgMessage]
})
export class BotModule {}
