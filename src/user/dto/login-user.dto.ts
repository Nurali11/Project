import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  password: string;
}
