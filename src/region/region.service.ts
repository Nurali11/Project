import {
  Injectable,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class RegionService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateRegionDto) {
    try {
      const region = await this.prisma.region.create({ data });
      return region;
    } catch (error) {
      throw new HttpException(
        'Region yaratishda xatolik yuz berdi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(query: {
    search?: string;
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const { search = '', sort = 'asc', page = 1, limit = 10 } = query;

      const regions = await this.prisma.region.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        orderBy: {
          name: sort,
        },
        skip: (page - 1) * limit,
        take: limit,
      });

      const total = await this.prisma.region.count({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
      });

      return {
        data: regions,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new BadRequestException('Regions not exists yet!');
    }
  }

  async findOne(id: string) {
    try {
      const region = await this.prisma.region.findUnique({
        where: { id },
      });

      if (!region) {
        throw new HttpException('Region topilmadi', HttpStatus.NOT_FOUND);
      }

      return region;
    } catch (error) {
      throw new HttpException(
        'Regionni olishda xatolik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateRegionDto) {
    try {
      const updated = await this.prisma.region.update({
        where: { id },
        data,
      });
      return updated;
    } catch (error) {
      throw new HttpException(
        'Regionni yangilashda xatolik',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.prisma.region.delete({
        where: { id },
      });
      return deleted;
    } catch (error) {
      throw new HttpException(
        'Regionni o‘chirishda xatolik',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
