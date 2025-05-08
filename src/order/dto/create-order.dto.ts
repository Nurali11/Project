import { IsInt, IsString, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { OrderItemDto } from './order-item.dto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateOrderDto {
    @ApiProperty()
  @IsString()
  table: string

  @ApiProperty()
  @IsString()
  restaurantId: string

  @ApiProperty()
  orderItems: [
    {
      productId: string,
      quantity: number
    }
  ];
  
}
