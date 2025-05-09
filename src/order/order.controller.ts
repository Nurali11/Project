import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Request } from 'express';
import { ApiQuery } from '@nestjs/swagger';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createOrderDto: CreateOrderDto, @Req() req: Request) {
    return this.orderService.create(createOrderDto, req);
  }

  @Get()
  @ApiQuery({ name: 'restaurantId', required: false })
  @ApiQuery({ name: 'productId', required: false })
  @ApiQuery({ name: 'quantity', required: false, type: Number })
  @ApiQuery({ name: 'sort', required: false, enum: ['asc', 'desc'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(
    @Query('restaurantId') restaurantId?: string,
    @Query('productId') productId?: string,
    @Query('quantity') quantity?: number,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.orderService.findAll({
      restaurantId,
      productId,
      quantity,
      sort,
      page,
      limit,
    });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.orderService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.update(+id, updateOrderDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.orderService.remove(+id);
  }
}
