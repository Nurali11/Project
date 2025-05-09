import { Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BadRequestException } from '@nestjs/common/exceptions';

@Injectable()
export class DebtService {
  constructor(
    private prisma: PrismaService
  ){}
  async create(data: CreateDebtDto) {
    try {
      let order = await this.prisma.order.findFirst({where: {id: data.orderId}})
      if(!order){
        throw new BadRequestException("Order not found")
      }


      let restaurant = await this.prisma.restaurant.findFirst({where: {id: data.restaurantId}})
      if(!restaurant){
        throw new BadRequestException("Restaurant not found")
      }


      if(data.amount > )
    } catch (error) {
      throw new BadRequestException()
    }
  }

  findAll() {
    return `This action returns all debt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} debt`;
  }

  update(id: number, updateDebtDto: UpdateDebtDto) {
    return `This action updates a #${id} debt`;
  }

  remove(id: number) {
    return `This action removes a #${id} debt`;
  }
}
