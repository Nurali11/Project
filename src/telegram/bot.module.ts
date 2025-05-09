import { Module } from '@nestjs/common';
import { Telegraf } from 'telegraf';
import { TelegrafModule } from 'nestjs-telegraf';

@Module({
  imports: [TelegrafModule.forRoot({
    token: "8130604725:AAEDXXfP10MoI6M9VJQFtonZvKJFvDgpj8k"
  })],
})
export class BotModule {}
