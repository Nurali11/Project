import { Start, Update, Hears } from 'nestjs-telegraf';
import { PrismaService } from 'src/prisma/prisma.service';
import { Context, Markup, session } from 'telegraf';
import { TelegrafModule } from 'nestjs-telegraf';

interface SessionData {
  selectedRestaurantId?: string;
}

interface MyContext extends Context {
  session?: SessionData;
}

@Update()
export class TgMessage {
  constructor(private prisma: PrismaService) {}

  @Start()
  async onStart(ctx: MyContext) {
    try {
      const restaurants = await this.prisma.restaurant.findMany();

      const keyboard = Markup.keyboard(
        restaurants.map((restaurant) => [restaurant.name]),
      )
        .resize()
        .oneTime();

      await ctx.reply(
        `Hush kelibsiz ${ctx.from?.first_name}🤗\nQaysi Restoran haqida malumot kerak?:`,
        keyboard,
      );
    } catch (error) {
      await ctx.reply(error.message);
    }
  }

  @Hears(/^.+$/)
  async onMessage(ctx: MyContext) {
    try {
      if (!ctx.message || !('text' in ctx.message)) return;

      const text = ctx.message.text;

      if (!ctx.session) {
        ctx.session = {};
      }

      const restaurant = await this.prisma.restaurant.findFirst({
        where: { name: text },
      });

      if (restaurant) {
        ctx.session.selectedRestaurantId = restaurant.id;

        const actionKeyboard = Markup.keyboard([['Order', 'Workers', 'Info']])
          .resize()
          .oneTime();

        await ctx.reply(
          `Rayhon restorani tanlandi: ${text}\nQanday malumot kerak?`,
          actionKeyboard,
        );
        return;
      }

      if (text === 'Order') {
        await this.handleOrder(ctx);
        return;
      }

      if (text === 'Workers') {
        await this.handleWorkers(ctx);
        return;
      }

      if (text === 'Info') {
        await this.handleInfo(ctx);
        return;
      }
    } catch (error) {
      await ctx.reply(error.message);
    }
  }

  async handleOrder(ctx: MyContext) {
    try {
      if (!ctx.session?.selectedRestaurantId) {
        const restaurants = await this.prisma.restaurant.findMany();

        const keyboard = Markup.keyboard(
          restaurants.map((restaurant) => [restaurant.name]),
        )
          .resize()
          .oneTime();

        await ctx.reply('Restoran tanlang', keyboard);
        return;
      }

      const orders = await this.prisma.order.findMany({
        where: { restaurantId: ctx.session.selectedRestaurantId },
        include: {
          Restaurant: true,
          OrderItems: {
            include: {
              product: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (orders.length === 0) {
        await ctx.reply('Hali hech qanday orderlar yoq');
        return;
      }

      for (const order of orders) {
        let message = `📌 Zakaz: ${order.id}\n`;
        message += `🍽️ Restoran: ${order.Restaurant?.name}\n`;
        message += `🪑 Table: ${order.table}\n`;
        message += `💰 Summa: ${order.total} сум\n`;
        message += `📅 Date: ${new Date(order.createdAt).toLocaleString()}\n`;
        message += `📊 Status: ${order.status}\n\n`;
        message += `🍱 Taomlar:\n`;

        for (const item of order.OrderItems) {
          message += `- ${item.product.name} ${item.quantity}ta = ${item.product.price * item.quantity} сум\n`;
        }

        message += `\n💵 Jami: ${order.total} so'm`;

        await ctx.reply(message);
      }

      const actionKeyboard = Markup.keyboard([['Order', 'Workers', 'Info']])
        .resize()
        .oneTime();

      await ctx.reply('Qanday malumot kerak:', actionKeyboard);
    } catch (error) {
      await ctx.reply(error.message);
    }
  }

  async handleWorkers(ctx: MyContext) {
    try {
      if (!ctx.session?.selectedRestaurantId) {
        const restaurants = await this.prisma.restaurant.findMany();

        const keyboard = Markup.keyboard(
          restaurants.map((restaurant) => [restaurant.name]),
        )
          .resize()
          .oneTime();

        await ctx.reply('Avval restoran tanlang', keyboard);
        return;
      }

      const workers = await this.prisma.user.findMany({
        where: { restaurantId: ctx.session.selectedRestaurantId },
        include: {
          Region: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      if (workers.length === 0) {
        await ctx.reply('Hali bu restoranda hech kim ishlamaydi');
        return;
      }

      for (const worker of workers) {
        let message = `👤 Ishci: ${worker.name}\n`;
        message += `📱 Telefon: ${worker.phone}\n`;
        message += `🏷️ Role: ${worker.role}\n`;
        message += `💰 Balance: ${worker.balans} сум\n`;
        message += `🏠 Region: ${worker.Region?.name}\n`;
        message += `📅 Qachondan beri ishlaydi: ${new Date(worker.createdAt).toLocaleString()}`;

        await ctx.reply(message);
      }

      const actionKeyboard = Markup.keyboard([['Order', 'Workers', 'Info']])
        .resize()
        .oneTime();

      await ctx.reply('Qanday malumot kerak:', actionKeyboard);
    } catch (error) {
      await ctx.reply(error.message);
    }
  }

  async handleInfo(ctx: MyContext) {
    try {
      if (!ctx.session?.selectedRestaurantId) {
        const restaurants = await this.prisma.restaurant.findMany();

        const keyboard = Markup.keyboard(
          restaurants.map((restaurant) => [restaurant.name]),
        )
          .resize()
          .oneTime();

        await ctx.reply('Avval restoran tanlang', keyboard);
        return;
      }

      const restaurant = await this.prisma.restaurant.findFirst({
        where: { id: ctx.session.selectedRestaurantId },
        include: {
          Products: true,
          Users: true,
          Orders: true,
          Categories: true,
          Withdraws: true,
          Debts: true,
        },
      });

      if (!restaurant) {
        await ctx.reply('Restoran topilmadi');
        return;
      }

      let message = `🏢 Restoran haqida to'liq ma'lumot:\n\n`;
      message += `📛 Nomi: ${restaurant.name}\n`;
      message += `📍 Manzil: ${restaurant.address}\n`;
      message += `📞 Telefon: ${restaurant.phone}\n`;
      message += `💳 Balans: ${restaurant.balance} сум\n`;
      message += `📅 Ochilgan sana: ${new Date(restaurant.createdAt).toLocaleString()}\n\n`;

      message += `🍽️ Taomlar (${restaurant.Products.length} ta):\n`;
      restaurant.Products.forEach((product) => {
        message += `- ${product.name}: ${product.price} сум\n`;
      });

      message += `\n👥 Xodimlar (${restaurant.Users.length} ta):\n`;
      restaurant.Users.forEach((user) => {
        message += `- ${user.name} (${user.role})\n`;
      });

      message += `\n📊 Zakazlar (${restaurant.Orders.length} ta):\n`;
      message += `- Jami summa: ${restaurant.Orders.reduce((sum, order) => sum + order.total, 0)} сум\n`;

      message += `\n📂 Kategoriyalar (${restaurant.Categories.length} ta):\n`;
      restaurant.Categories.forEach((category) => {
        message += `- ${category.name}\n`;
      });

      await ctx.reply(message);

      const actionKeyboard = Markup.keyboard([['Order', 'Workers', 'Info']])
        .resize()
        .oneTime();

      await ctx.reply('Qanday malumot kerak:', actionKeyboard);
    } catch (error) {
      await ctx.reply(error.message);
    }
  }
}
