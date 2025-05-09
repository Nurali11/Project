import { ApiProperty } from '@nestjs/swagger';
import { WithdrawType } from '@prisma/client';
import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateWithdrawDto {
  @ApiProperty({ enum: WithdrawType, example: 'OUTCOME or INCOME' })
  @IsEnum(WithdrawType)
  type: WithdrawType;

  @ApiProperty()
  @IsString()
  @IsUUID()
  restaurantId: string;

  @ApiProperty({ example: 'Is optional' })
  @IsString()
  @IsOptional()
  @IsUUID()
  orderId?: string;
}
