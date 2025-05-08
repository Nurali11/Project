import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(data: CreateUserDto) {
    try {
      const hash = bcrypt.hashSync(data.password, 10);

      const user = await this.prisma.user.create({
        data: { ...data, password: hash },
      });
      return user;
    } catch (error) {
      throw new HttpException(
        'User yaratishda xatolik yuz berdi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async login(data: LoginUserDto) {
    try {
      const user = await this.prisma.user.findFirst({
        where: { name: data.name },
      });

      if (!user) {
        throw new BadRequestException('User not found!');
      }

      const match = await bcrypt.compare(data.password, user.password);
      if (!match) {
        throw new BadRequestException('Wrong credentials!');
      }

      const payload = { id: user.id, role: user.role };

      const access_token = this.jwt.sign(payload, {
        secret: 'accessSecret',
        expiresIn: '15m',
      });

      const refresh_token = this.jwt.sign(payload, {
        secret: 'refreshSecret',
        expiresIn: '7d',
      });

      return { access_token, refresh_token };
    } catch (error) {
      throw new HttpException(
        'User login qilishda xatolik yuz berdi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(query: {
    name?: string;
    phone?: string;
    regionId?: number;
    role?: 'ADMIN' | 'SUPER_ADMIN' | 'OWNER' | 'CASHER' | 'WAITER';
    page?: number;
    limit?: number;
    sort?: 'asc' | 'desc';
  }) {
    try {
      const {
        name,
        phone,
        regionId,
        role,
        page = 1,
        limit = 10,
        sort = 'asc',
      } = query;

      const skip = (page - 1) * limit;

      const users = await this.prisma.user.findMany({
        where: {
          name: name ? { contains: name, mode: 'insensitive' } : undefined,
          phone: phone
            ? { contains: phone, mode: 'insensitive' }
            : undefined,
          regionId: regionId ? String(regionId) : undefined,
          role: role ? role : undefined,
        },
        orderBy: {
          name: sort,
        },
        skip,
        take: Number(limit),
      });

      if (!users.length) return "Users aren't exists yet!";
      return users;
    } catch (error) {
      throw new HttpException(
        'Userlarni getAll qilishda xatolik yuz berdi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOne(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User topilmadi!');
      return user;
    } catch (error) {
      throw new HttpException(
        'Userni olishda xatolik yuz berdi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(id: string, data: UpdateUserDto) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User topilmadi!');

      if (data.password) {
        data.password = bcrypt.hashSync(data.password, 10);
      }

      return await this.prisma.user.update({
        where: { id },
        data,
      });
    } catch (error) {
      throw new HttpException(
        'Userni update qilishda xatolik yuz berdi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.findUnique({ where: { id } });
      if (!user) throw new NotFoundException('User topilmadi!');

      await this.prisma.user.delete({ where: { id } });
      return { message: 'User muvaffaqiyatli o‘chirildi' };
    } catch (error) {
      throw new HttpException(
        'Userni o‘chirishda xatolik yuz berdi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
