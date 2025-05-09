import { Start, Update } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context } from 'telegraf';

@Update()
export class TgMessage {
  constructor(private prisma: PrismaService) {}

  @Start()
  async onStart(ctx: Context) {
    try {
      // Получаем список ресторанов из базы данных
      const restaurants = await this.prisma.restaurant.findMany();

      // Создаем обычную клавиатуру с кнопками для каждого ресторана
      const keyboard = {
        keyboard: restaurants.map(restaurant => [
          { text: restaurant.name }, // Кнопка для каждого ресторана
        ]),
        resize_keyboard: true, // Автоматическая подгонка клавиатуры под размер экрана
        one_time_keyboard: true, // Клавиатура скрывается после использования
      };

      // Отправляем сообщение с кнопками на обычной клавиатуре
      await ctx.reply(`Hush kelibsiz ${ctx.from?.first_name}🤗`, { reply_markup: keyboard });
    } catch (error) {
      return error.message;
    }
  }
}
