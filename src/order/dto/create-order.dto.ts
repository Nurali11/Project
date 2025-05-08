import { IsString, IsUUID, IsOptional, IsArray } from 'class-validator';

export class CreateOrderDto {
  @IsUUID()
  restaurantId: string;

  @IsString()
  table: string;

  @IsOptional()
  @IsArray()
  @IsUUID('all', { each: true })
  productIds?: string[];
}
