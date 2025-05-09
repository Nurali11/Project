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
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { ApiQuery } from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleGuard } from 'src/role/role.guard';
import { RoleType } from '@prisma/client';
import { Roles } from 'src/user/decorators/roles.decorators';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Roles(RoleType.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtService.create(createDebtDto);
  }

  @Roles(RoleType.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get()
  @ApiQuery({ name: 'orderId', required: false, type: String })
  @ApiQuery({ name: 'restaurantId', required: false, type: String })
  @ApiQuery({ name: 'client', required: false, type: String })
  @ApiQuery({ name: 'minAmount', required: false, type: Number })
  @ApiQuery({ name: 'maxAmount', required: false, type: Number })
  @ApiQuery({ name: 'sortByAmount', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query() query: any) {
    return this.debtService.findAll(query);
  }

  @Roles(RoleType.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtService.findOne(id);
  }

  @Roles(RoleType.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
    return this.debtService.update(id, updateDebtDto);
  }

  @Roles(RoleType.CASHER)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtService.remove(id);
  }
}
