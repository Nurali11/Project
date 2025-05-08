import { ApiProperty } from '@nestjs/swagger'
import { IsInt } from 'class-validator'

export class OrderItemDto {
@ApiProperty()
  @IsInt()
  productId: string

  @ApiProperty()
  @IsInt()
  quantity: number
}
