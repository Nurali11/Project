import { Injectable } from '@nestjs/common/decorators';
import { CreateRestarauntDto } from './dto/create-restaraunt.dto';
import { UpdateRestarauntDto } from './dto/update-restaraunt.dto';
import { BadRequestException } from '@nestjs/common/exceptions';
import { PrismaService } from 'src/prisma/prisma.service';
import { contains } from 'class-validator';

@Injectable()
export class RestarauntService {
  constructor(
    private prisma: PrismaService 
  ){}
  async create(data: CreateRestarauntDto) {
    try {
      let region = await this.prisma.region.findFirst({where: {id: data.regionId}})
      if(!region){
        throw new BadRequestException(`Region with ${data.regionId} id not found`)
      }
      let rest = await this.prisma.restaurant.create({data})
      return rest
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async findAll(query: any) {
    try {
      const { name, tip, address, page = 1, limit = 10, regionId, isActive } = query;
      const filter: any = {};
  
      if (name) {
        filter.name = { contains: name, mode: "insensitive" };
      }
  
      if (address) {
        filter.address = { contains: address, mode: "insensitive" };
      }
  
      if (regionId) {
        filter.regionId = regionId;
      }
  
      if (typeof tip !== 'undefined') {
        filter.tip = Number(tip);
      }
  
      if (typeof isActive !== 'undefined') {
        filter.isActive = isActive === 'true' || isActive === true;
      }
  
      const restaurants = await this.prisma.restaurant.findMany({
        where: filter,
        skip: (page - 1) * limit,
        take: +limit,
        orderBy: {
          createdAt: 'desc',
        },
      });
      const total = restaurants.length

      return {
        data: restaurants,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException(error.message);
    }
  }
  

  async findOne(id: string) {
    try {
      let one = await this.prisma.restaurant.findFirst({where: {id}})
      return one
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async update(id: string, data: UpdateRestarauntDto) {
    try {
      let updated = await this.prisma.restaurant.update({where: {id}, data})
      return updated
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  async remove(id: string) {
    try {
      let deleted = await this.prisma.restaurant.delete({where: {id}})
      return deleted
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
}
