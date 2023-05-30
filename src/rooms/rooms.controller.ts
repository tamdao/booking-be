import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { IsDate, IsInt, Max, Min } from 'class-validator';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from '@prisma/client';
import { Type } from 'class-transformer';

class FindAllQuery {
  @IsInt()
  @Min(5)
  @Max(100)
  @Type(() => Number)
  limit: number;

  @IsInt()
  @Min(0)
  @Type(() => Number)
  offset: number;

  @IsDate()
  @Type(() => Date)
  from: Date;

  @IsDate()
  @Type(() => Date)
  to: Date;
}

@Controller('rooms')
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body() createRoomDto: CreateRoomDto) {
    return this.roomsService.create(createRoomDto);
  }

  @Get()
  async findAll(@Query() query: FindAllQuery) {
    const [total, items] = await this.roomsService.findAllAvailable({
      skip: query.offset,
      take: query.limit,
      where: {
        OR: [
          {
            checkin: {
              lte: query.from,
              gte: query.to,
            },
          },
          {
            checkout: {
              gte: query.from,
              lte: query.to,
            },
          },
        ],
        expiredAt: {
          gt: new Date(),
        },
      },
    });
    return { total, items, ...query };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne({ id });
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateRoomDto) {
    return this.roomsService.update({ where: { id }, data: updateRoomDto });
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(@Param('id') id: string) {
    return this.roomsService.remove({ id });
  }
}
