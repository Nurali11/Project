import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { ApiQuery } from '@nestjs/swagger';
import { RoleGuard } from 'src/role/role.guard';
import { Roles } from 'src/user/decorators/roles.decorators';
import { AuthGuard } from 'src/auth/auth.guard';
import { RoleType } from '@prisma/client';

@Controller('region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createRegionDto: CreateRegionDto) {
    return this.regionService.create(createRegionDto);
  }

  @Get()
  @ApiQuery({
    name: 'search',
    required: false,
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    enum: ['asc', 'desc'],
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  findAll(
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.regionService.findAll({ search, sort, page, limit });
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.regionService.findOne(id);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRegionDto: UpdateRegionDto) {
    return this.regionService.update(id, updateRegionDto);
  }

  @Roles(RoleType.ADMIN)
  @UseGuards(RoleGuard)
  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }
}
