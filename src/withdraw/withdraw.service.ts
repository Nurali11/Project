import { Injectable } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';

@Injectable()
export class WithdrawService {
  create(data: CreateWithdrawDto) {
    try {
      
    } catch (error) {
      
    }
  }

  findAll() {
    return `This action returns all withdraw`;
  }

  findOne(id: number) {
    return `This action returns a #${id} withdraw`;
  }

  update(id: number, updateWithdrawDto: UpdateWithdrawDto) {
    return `This action updates a #${id} withdraw`;
  }

  remove(id: number) {
    return `This action removes a #${id} withdraw`;
  }
}
