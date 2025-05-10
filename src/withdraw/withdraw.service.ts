import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';

@Injectable()
export class WithdrawService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateWithdrawDto) {
    try {
      if (data.orderId) {
        const order = await this.prisma.order.findUnique({
          where: { id: data.orderId },
          include: {
            OrderItems: {
              include: {
                product: true,
              },
            },
            Restaurant: true,
          },
        });

        if (!order) throw new NotFoundException('Order topilmadi');

        const total = order.OrderItems.reduce((sum, item) => {
          return sum + item.quantity * item.product.price;
        }, 0);

        const tipPercent = order.Restaurant?.tip ?? 0;
        const tipAmount = (total * tipPercent) / 100;
        const finalAmount = total - tipAmount;

        await this.prisma.restaurant.update({
          where: { id: order.restaurantId ?? undefined },
          data: {
            balance: {
              increment: finalAmount,
            },
          },
        });
      }

      const newWithdraw = await this.prisma.withdraw.create({
        data,
      });

      await this.prisma.order.update({
        where: { id: data.orderId },
        data: { status: 'PAID' },
      });
      return newWithdraw;
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Withdraw yaratishda xatolik');
    }
  }

  async findAll(query: {
    orderId?: string;
    restaurantId?: string;
    type?: 'INCOME' | 'OUTCOME';
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        orderId,
        restaurantId,
        type,
        sort = 'desc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};
      if (orderId) where.orderId = orderId;
      if (restaurantId) where.restaurantId = restaurantId;
      if (type) where.type = type;

      const skip = (page - 1) * limit;

      const data = await this.prisma.withdraw.findMany({
        where,
        orderBy: { createdAt: sort },
        skip,
        take: limit,
        include: {
          Restaurant: true,
          Order: true,
        },
      });

      const total = await this.prisma.withdraw.count({ where });

      return {
        data,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    } catch (error) {
      console.error(error);
      throw new BadRequestException('Withdraws are not exists yet!');
    }
  }

  async findOne(id: string) {
    try {
      const withdraw = await this.prisma.withdraw.findUnique({
        where: { id },
        include: {
          Restaurant: true,
          Order: true,
        },
      });
      if (!withdraw) {
        throw new NotFoundException('Withdraw topilmadi');
      }
      return withdraw;
    } catch (error) {
      throw new BadRequestException('Withdrawni olishda xatolik');
    }
  }

  async update(id: string, updateWithdrawDto: UpdateWithdrawDto) {
    try {
      const existing = await this.prisma.withdraw.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('Yangilamoqchi bo‘lgan withdraw topilmadi');
      }

      return await this.prisma.withdraw.update({
        where: { id },
        data: updateWithdrawDto,
      });
    } catch (error) {
      throw new BadRequestException('Withdrawni yangilashda xatolik');
    }
  }

  async remove(id: string) {
    try {
      const existing = await this.prisma.withdraw.findUnique({ where: { id } });
      if (!existing) {
        throw new NotFoundException('O‘chirmoqchi bo‘lgan withdraw topilmadi');
      }

      return await this.prisma.withdraw.delete({
        where: { id },
      });
    } catch (error) {
      throw new BadRequestException('Withdrawni o‘chirishda xatolik');
    }
  }
}
