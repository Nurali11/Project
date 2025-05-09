import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { DebtService } from './debt.service';
import { CreateDebtDto } from './dto/create-debt.dto';
import { UpdateDebtDto } from './dto/update-debt.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('debt')
export class DebtController {
  constructor(private readonly debtService: DebtService) {}

  @Post()
  create(@Body() createDebtDto: CreateDebtDto) {
    return this.debtService.create(createDebtDto);
  }

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

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.debtService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDebtDto: UpdateDebtDto) {
    return this.debtService.update(id, updateDebtDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.debtService.remove(id);
  }
}
