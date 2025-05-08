import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
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

  async findAll() {
    try {
      const user = await this.prisma.user.findMany();
      if (!user) {
        return "Users aren't exists yet!";
      }
      return user;
    } catch (error) {
      throw new HttpException(
        'Userlarni getAll qilishda xatolik yuz berdi',
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
