import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class DebtService {
  constructor(
    private prisma : PrismaService
  ){}
  async create(data: CreateDebtDto) {
    try {
      let order = await this.prisma.order.findFirst({where: {id: data.orderId}})
      if(!order){
        throw new BadRequestException("Order not found")
      }
      if(order.restaurantId != data.restaurantId){
        throw new BadRequestException("This restaurant doesnt have this order")
      }

      if(data.amount > order.total){
        throw new BadRequestException("Debt cannot be higher that total sum of order")
      }

      let debt = await this.prisma.debt.create({
        data: {
          orderId: data.orderId,
          amount: data.amount,
          restaurantId: data.restaurantId,
          username: data.client
        }
      })

      await this.prisma.order.update({where: {id: data.orderId, restaurantId: data.restaurantId}, data: {status: "DEBT"}})
      return debt
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll() {
    try {
      let all = await this.prisma.debt.findMany()
      return all
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findOne(id: string) {
    try {
      let one = await this.prisma.debt.findFirst({where: {id}})
      return one
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, data: UpdateDebtDto){
    try {
      let updated = await this.prisma.debt.update({where: {id}, data})
      return updated
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string){
    try {
      let deleted = await this.prisma.debt.delete({where: {id}})
      return deleted
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
