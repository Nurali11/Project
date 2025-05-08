import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { RestarauntService } from './restaraunt.service';
import { CreateRestarauntDto } from './dto/create-restaraunt.dto';
import { UpdateRestarauntDto } from './dto/update-restaraunt.dto';
import { ApiQuery } from '@nestjs/swagger';

@Controller('restaraunt')
export class RestarauntController {
  constructor(private readonly restarauntService: RestarauntService) {}

  @Post()
  create(@Body() createRestarauntDto: CreateRestarauntDto) {
    return this.restarauntService.create(createRestarauntDto);
  }

  @ApiQuery({
    name: "name",
    required: false,
  })
  @ApiQuery({
    name: "regionId",
    required: false
  })
  @ApiQuery({
    name: "tip",
    required: false,
  })
  @ApiQuery({
    name: "address" ,
    required: false,
  })
  @ApiQuery({
    name: "isActive",
    enum: ["true", "false"],
    required: false
    })
    @ApiQuery({
      name: "page",
    required: false
    })
    @ApiQuery({
      name: "limit",
      required: false
    })
    @Get()
    findAll(
      @Query("name") name?: string,
      @Query("regionId") regionId?: string,
      @Query("tip") tip?: number,
      @Query("address") address?: string,
      @Query("isActive") isActive?: boolean,
      @Query("page") page?: number,
      @Query("limit") limit?: number,
    ) {
      return this.restarauntService.findAll({name, regionId, tip, address, isActive, page, limit});
    }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.restarauntService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRestarauntDto: UpdateRestarauntDto) {
    return this.restarauntService.update(id, updateRestarauntDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.restarauntService.remove(id);
  }
}
