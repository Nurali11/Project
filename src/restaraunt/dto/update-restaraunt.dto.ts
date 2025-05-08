import { PartialType } from '@nestjs/mapped-types';
import { CreateRestarauntDto } from './create-restaraunt.dto';

export class UpdateRestarauntDto extends PartialType(CreateRestarauntDto) {}
