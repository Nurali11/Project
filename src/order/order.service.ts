import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Request } from 'express';

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}
  async create(data: CreateOrderDto, req: Request) {
    try {
      let waiter = await this.prisma.user.findFirst({
        where: { id: req['user'].id },
      });
      if (!waiter) {
        throw new BadRequestException('Waiter not found.');
      }

      let restaraunt = await this.prisma.restaurant.findFirst({
        where: { id: data.restaurantId },
      });
      if (!restaraunt) {
        throw new BadRequestException(
          `Restaurant with ${data.restaurantId} id not found`,
        );
      }

      let total = 0;
      for (let i of data.orderItems) {
        let prd = await this.prisma.product.findFirst({
          where: { id: i.productId },
        });
        if (!prd) {
          throw new BadRequestException(`Product with ${i} id not found`);
        }

        total += prd.price * i.quantity;
      }
      const order = await this.prisma.order.create({
        data: {
          table: data.table,
          restaurantId: data.restaurantId,
          OrderItems: {
            create: data.orderItems.map((item) => ({
              product: {
                connect: { id: item.productId.toString() },
              },
              quantity: item.quantity,
            })),
          },
        },
        include: {
          OrderItems: true,
        },
      });

      let qoshishPul = await this.prisma.user.update({
        where: { id: req['user'].id },
        data: { balans: waiter.balans + (total / 100) * restaraunt.tip },
      });

      return {
        order,
        message: `$${(total / 100) * restaraunt.tip} qoshildi waiterga. Waiter money - ${qoshishPul.balans}`,
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findAll() {
    try {
      let all = await this.prisma.order.findMany();
      return all;
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async findOne(id: number) {
    try {
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }

  async remove(id: number) {
    try {
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
}
