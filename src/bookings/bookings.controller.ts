import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto } from './dto/update-booking.dto';
import { IsInt, Max, Min } from 'class-validator';
import { GetUser } from 'src/decorators/get-user.decorator';
import { User } from '@prisma/client';
import * as dayjs from 'dayjs';
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
}

@Controller('bookings')
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Post()
  create(@GetUser() user: User, @Body() createBookingDto: CreateBookingDto) {
    return this.bookingsService.create({
      checkin: createBookingDto.checkin,
      checkout: createBookingDto.checkout,
      room: {
        connect: {
          id: createBookingDto.roomId,
        },
      },
      user: {
        connect: {
          id: user.id,
        },
      },
      expiredAt: dayjs(new Date()).add(15, 'minutes').toISOString(),
    });
  }

  @Post(':id/confirm')
  async confirm(@Param('id') id: string) {
    const booking = await this.bookingsService.findOne({
      id,
      expiredAt: {
        gt: new Date(),
      },
    });

    if (!booking) {
      throw new ForbiddenException('Booking code was expired');
    }

    return this.bookingsService.update({
      where: { id },
      data: {
        status: 'CONFIRMED',
        expiredAt: booking.checkout,
      },
    });
  }

  @Get()
  async findAll(@GetUser() user, @Query() query: FindAllQuery) {
    const [total, items] = await this.bookingsService.findAll({
      where: {
        userId: user.id,
      },
      skip: query.offset,
      take: query.limit,
    });
    return { total, items, ...query };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bookingsService.findOne({ id });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoomDto: UpdateBookingDto) {
    return this.bookingsService.update({ where: { id }, data: updateRoomDto });
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookingsService.remove({ id });
  }
}
