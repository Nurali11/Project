import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    try {
      let prd = await this.prisma.product.create({ data });
      return prd;
    } catch (error) {
      throw new HttpException(
        'Mahsulot yaratishda xatolik',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(query: {
    name?: string;
    price?: number;
    isActive?: boolean;
    restaurantId?: string;
    categoryId?: string;
    sort?: 'asc' | 'desc';
    page?: number;
    limit?: number;
  }) {
    try {
      const {
        name = '',
        price,
        isActive,
        restaurantId,
        categoryId,
        sort = 'asc',
        page = 1,
        limit = 10,
      } = query;

      const where: any = {
        name: { contains: name, mode: 'insensitive' },
      };

      if (price !== undefined) where.price = price;
      if (isActive !== undefined) where.isActive = isActive;
      if (restaurantId !== undefined) where.restaurantId = restaurantId;
      if (categoryId !== undefined) where.categoryId = categoryId;

      const products = await this.prisma.product.findMany({
        where,
        orderBy: { name: sort },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          Restaurant: true,
          Category: true,
        },
      });

      const total = await this.prisma.product.count({ where });

      return {
        data: products,
        meta: {
          total,
          page,
          limit,
          lastPage: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      throw new HttpException(
        'Mahsulotlarni olishda xatolik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async findOne(id: string) {
    try {
      const product = await this.prisma.product.findUnique({
        where: { id },
        include: {
          Restaurant: true,
          Category: true,
        },
      });
      if (!product)
        throw new HttpException('Mahsulot topilmadi', HttpStatus.NOT_FOUND);
      return product;
    } catch (error) {
      throw new HttpException(
        'Mahsulotni olishda xatolik',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    try {
      return await this.prisma.product.update({
        where: { id },
        data: updateProductDto,
      });
    } catch (error) {
      throw new HttpException(
        'Mahsulotni yangilashda xatolik',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.product.delete({ where: { id } });
    } catch (error) {
      throw new HttpException(
        'Mahsulotni o‘chirishda xatolik',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
