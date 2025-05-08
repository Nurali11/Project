import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrderService {
  constructor(
    private prisma: PrismaService
  ){}
  async create(data: CreateOrderDto) {
    try {
      const order = await this.prisma.order.create({
        data: {
          restaurantId: data.restaurantId,
          table: data.table,
          ...(data.productIds?.length
            ? {
                Products: {
                  connect: data.productIds.map(id => ({ id })),
                },
              }
            : {}),
        },
      });
      
      return order
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      let all = await this.prisma.order.findMany()
      return all
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: number) {
    try {
      
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    try {
      
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: number) {
    try {
      
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
