import { Injectable } from '@nestjs/common';
import { Prisma, Room } from '@prisma/client';
import { PrismaService } from 'src/services/prisma/prisma.service';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.RoomCreateInput): Promise<Room> {
    return this.prisma.room.create({
      data,
    });
  }

  async findAll(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoomWhereUniqueInput;
    where?: Prisma.RoomWhereInput;
    orderBy?: Prisma.RoomOrderByWithRelationInput;
  }): Promise<[number, Room[]]> {
    const { skip, take, cursor, where, orderBy } = params;

    return Promise.all([
      this.prisma.room.count({
        where,
      }),
      this.prisma.room.findMany({
        skip,
        take,
        cursor,
        where,
        orderBy,
      }),
    ]);
  }

  async findAllAvailable(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.RoomWhereUniqueInput;
    where?: Prisma.BookingWhereInput;
    orderBy?: Prisma.RoomOrderByWithRelationInput;
  }): Promise<[number, Room[]]> {
    const { skip, take, cursor, where, orderBy } = params;
    const bookings = await this.prisma.booking.findMany({
      where,
    });

    console.log('bookings', bookings);

    const roomIds = bookings.map((b) => b.roomId);

    return Promise.all([
      this.prisma.room.count({
        where: {
          id: {
            notIn: roomIds,
          },
        },
      }),
      this.prisma.room.findMany({
        skip,
        take,
        cursor,
        where: {
          id: {
            notIn: roomIds,
          },
        },
        orderBy,
      }),
    ]);
  }

  findOne(
    roomWhereUniqueInput: Prisma.RoomWhereUniqueInput,
  ): Promise<Room | null> {
    return this.prisma.room.findUnique({
      where: roomWhereUniqueInput,
    });
  }

  update(params: {
    where: Prisma.RoomWhereUniqueInput;
    data: Prisma.RoomUpdateInput;
  }): Promise<Room> {
    const { where, data } = params;
    return this.prisma.room.update({
      data,
      where,
    });
  }

  remove(where: Prisma.RoomWhereUniqueInput): Promise<Room> {
    return this.prisma.room.delete({
      where,
    });
  }
}
