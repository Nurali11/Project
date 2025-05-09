import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DebtService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateDebtDto) {
    try {
      let order = await this.prisma.order.findFirst({
        where: { id: data.orderId },
      });
      if (!order) {
        throw new BadRequestException('Order not found');
      }
      if (order.restaurantId != data.restaurantId) {
        throw new BadRequestException('This restaurant doesnt have this order');
      }

      if (data.amount > order.total) {
        throw new BadRequestException(
          'Debt cannot be higher that total sum of order',
        );
      }

      let debt = await this.prisma.debt.create({
        data: {
          orderId: data.orderId,
          amount: data.amount,
          restaurantId: data.restaurantId,
          username: data.client,
        },
      });

      await this.prisma.order.update({
        where: { id: data.orderId, restaurantId: data.restaurantId },
        data: { status: 'DEBT' },
      });
      return debt;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll(query: {
    orderId?: string;
    restaurantId?: string;
    client?: string;
    minAmount?: number;
    maxAmount?: number;
    sortByAmount?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        orderId,
        restaurantId,
        client,
        minAmount,
        maxAmount,
        sortByAmount,
        page = 1,
        limit = 10,
      } = query;

      const where: any = {};

      if (orderId) where.orderId = orderId;
      if (restaurantId) where.restaurantId = restaurantId;
      if (client) where.username = { contains: client, mode: 'insensitive' };
      if (minAmount || maxAmount) {
        where.amount = {};
        if (minAmount) where.amount.gte = minAmount;
        if (maxAmount) where.amount.lte = maxAmount;
      }

      const debts = await this.prisma.debt.findMany({
        where,
        orderBy: sortByAmount ? { amount: sortByAmount } : undefined,
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.debt.count({ where });

      return {
        data: debts,
        meta: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: string) {
    try {
      let one = await this.prisma.debt.findFirst({ where: { id } });
      return one;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: string, data: UpdateDebtDto) {
    try {
      let updated = await this.prisma.debt.update({ where: { id }, data });
      return updated;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: string) {
    try {
      let deleted = await this.prisma.debt.delete({ where: { id } });
      return deleted;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
