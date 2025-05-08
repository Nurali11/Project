import { Injectable } from '@nestjs/common';
import { CreateRestarauntDto } from './dto/create-restaraunt.dto';
import { UpdateRestarauntDto } from './dto/update-restaraunt.dto';

@Injectable()
export class RestarauntService {
  create(createRestarauntDto: CreateRestarauntDto) {
    return 'This action adds a new restaraunt';
  }

  findAll() {
    return `This action returns all restaraunt`;
  }

  findOne(id: number) {
    return `This action returns a #${id} restaraunt`;
  }

  update(id: number, updateRestarauntDto: UpdateRestarauntDto) {
    return `This action updates a #${id} restaraunt`;
  }

  remove(id: number) {
    return `This action removes a #${id} restaraunt`;
  }
}
