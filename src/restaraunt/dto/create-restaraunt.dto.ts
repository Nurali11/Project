import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsNumber,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
  Max,
  Min,
} from 'class-validator';

export class CreateRestarauntDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  regionId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0)
  @Max(100)
  tip: number;

  @ApiProperty()
  @IsString()
  address: string;

  @ApiProperty({
    example: '+998901234567',
  })
  @IsString()
  @IsPhoneNumber()
  phone: string;

  @ApiProperty()
  @IsBoolean()
  isActive: boolean;
}
