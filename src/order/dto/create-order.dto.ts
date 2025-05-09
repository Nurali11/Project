import { Type } from 'class-transformer';
import { IsString, ValidateNested } from 'class-validator';
import { OrderItemDto } from './order-item.dto';
import { ApiProperty } from '@nestjs/swagger';

export class CreateOrderDto {
  @ApiProperty()
  @IsString()
  table: string;

  @ApiProperty()
  @IsString()
  restaurantId: string;

  @ApiProperty({ type: [OrderItemDto] })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  orderItems: OrderItemDto[];
}
