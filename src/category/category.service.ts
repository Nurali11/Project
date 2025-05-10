import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateCategoryDto) {
    try {
      const category = await this.prisma.category.create({ data });
      return category;
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(query: {
    name?: string;
    restaurantId?: number;
    isActive?: boolean;
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        name = '',
        restaurantId,
        isActive,
        sort = 'asc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      };

      if (restaurantId) where.restaurantId = Number(restaurantId);
      if (typeof isActive === 'boolean') where.isActive = isActive;

      const categories = await this.prisma.category.findMany({
        where,
        orderBy: {
          name: sort,
        },
        include: {
          Restaurant: true,
        },
        skip: (page - 1) * limit,
        take: Number(limit),
      });

      const total = await this.prisma.category.count({ where });

      return {
        data: categories,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        'Kategoriyalarni olishda xatolik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const category = await this.prisma.category.findUnique({
        where: { id },
        include: {
          Restaurant: true,
        },
      });

      if (!category) {
        throw new HttpException('Category topilmadi', HttpStatus.NOT_FOUND);
      }

      return category;
    } catch (error) {
      throw new HttpException(
        'Categoryni olishda xatolik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, data: UpdateCategoryDto) {
    try {
      const updated = await this.prisma.category.update({
        where: { id },
        data,
      });
      return updated;
    } catch (error) {
      throw new HttpException(
        'Categoryni yangilashda xatolik',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const deleted = await this.prisma.category.delete({
        where: { id },
      });
      return deleted;
    } catch (error) {
      throw new HttpException(
        'Categoryni o‘chirishda xatolik',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
