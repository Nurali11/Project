import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString, IsUUID } from 'class-validator';

export class OrderItemDto {
  @ApiProperty()
  @IsString()
  @IsUUID()
  productId: string;

  @ApiProperty()
  @IsInt()
  quantity: number;
}
