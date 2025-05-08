import { IsString, IsUUID, IsArray, ValidateNested } from 'class-validator'
import { Type } from 'class-transformer'
import { OrderItemDto } from './order-item.dto'
import { ApiProperty } from '@nestjs/swagger'

export class CreateOrderDto {
    @ApiProperty()
  @IsUUID()
  restaurantId: string

  @ApiProperty()
  @IsString()
  table: string

    @ApiProperty()
    @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[]
}
