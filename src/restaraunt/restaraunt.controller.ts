import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { RestarauntService } from './restaraunt.service';
import { CreateRestarauntDto } from './dto/create-restaraunt.dto';
import { UpdateRestarauntDto } from './dto/update-restaraunt.dto';

@Controller('restaraunt')
export class RestarauntController {
  constructor(private readonly restarauntService: RestarauntService) {}

  @Post()
  create(@Body() createRestarauntDto: CreateRestarauntDto) {
    return this.restarauntService.create(createRestarauntDto);
  }

  @Get()
  findAll() {
    return this.restarauntService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restarauntService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestarauntDto: UpdateRestarauntDto) {
    return this.restarauntService.update(+id, updateRestarauntDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restarauntService.remove(+id);
  }
}
