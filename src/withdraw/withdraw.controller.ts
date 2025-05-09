import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { WithdrawService } from './withdraw.service';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleType } from '@prisma/client';
import { Roles } from 'src/user/decorators/roles.decorators';
import { RoleGuard } from 'src/role/role.guard';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('withdraw')
export class WithdrawController {
  constructor(private readonly withdrawService: WithdrawService) {}

  @Roles(RoleType.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createWithdrawDto: CreateWithdrawDto) {
    return this.withdrawService.create(createWithdrawDto);
  }

  @Roles(RoleType.CASHER, RoleType.OWNER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'orderId', required: false, type: String })
  @ApiQuery({ name: 'restaurantId', required: false, type: String })
  @ApiQuery({ name: 'type', required: false, enum: ['INCOME', 'OUTCOME'] })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('orderId') orderId?: string,
    @Query('restaurantId') restaurantId?: string,
    @Query('type') type?: 'INCOME' | 'OUTCOME',
    @Query('sort') sort: 'asc' | 'desc' = 'desc',
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.withdrawService.findAll({
      orderId,
      restaurantId,
      type,
      sort,
      page,
      limit,
    });
  }

  @Roles(RoleType.CASHER, RoleType.OWNER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.withdrawService.findOne(id);
  }

  @Roles(RoleType.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateWithdrawDto: UpdateWithdrawDto,
  ) {
    return this.withdrawService.update(id, updateWithdrawDto);
  }

  @Roles(RoleType.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.withdrawService.remove(id);
  }
}
