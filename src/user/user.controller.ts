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
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

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
  @ApiQuery({ name: 'phoneNumber', required: false })
  @ApiQuery({ name: 'regionId', required: false, type: Number })
  @ApiQuery({
    name: 'role',
    required: false,
    enum: ['ADMIN', 'SUPER_ADMIN', 'OWNER', 'CASHER', 'WAITER'],
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  getAll(
    @Query('name') name?: string,
    @Query('phoneNumber') phone?: string,
    @Query('regionId') regionId?: number,
    @Query('role')
    role?: 'ADMIN' | 'SUPER_ADMIN' | 'OWNER' | 'CASHER' | 'WAITER',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: 'asc' | 'desc',
  ) {
    return this.userService.findAll({
      name,
      phone,
      regionId: regionId ? Number(regionId) : undefined,
      role,
      page,
      limit,
      sort,
    });
  }

  @Get(':id')
  getOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: string, @Body() data: UpdateUserDto) {
    return this.userService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: string) {
    return this.userService.remove(id);
  }
}
