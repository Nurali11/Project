import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery } from '@nestjs/swagger';
import { Roles } from './decorators/roles.decorators';
import { RoleType } from '@prisma/client';
import { RoleGuard } from 'src/role/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() data: CreateUserDto) {
    return this.userService.register(data);
  }

  @Post('login')
  login(@Body() data: LoginUserDto) {
    return this.userService.login(data);
  }

  @Get()
  @ApiQuery({ name: 'name', required: false })
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiQuery({ name: 'phoneNumber', required: false })
  @ApiQuery({ name: 'regionId', required: false, type: Number })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: ['ADMIN', 'SUPER_ADMIN', 'CASHER', 'WAITER'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  getAll(
    @Query('name') name?: string,
    @Query('phoneNumber') phone?: string,
    @Query('restaurantId') restaurantId?: string,
    @Query('regionId') regionId?: number,
    @Query('role')
    role?: 'ADMIN' | 'SUPER_ADMIN' | 'CASHER' | 'WAITER',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ) {
    return this.userService.findAll({
      name,
      phone,
      restaurantId,
      regionId: regionId ? String(regionId) : undefined,
      role,
      page,
      limit,
      sort,
    });
  }

  @Get(':id')
  getOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id/role')
  updateRoleToAdmin(@Param('id') id: string) {
    return this.userService.updateRoleToAdmin(id);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
