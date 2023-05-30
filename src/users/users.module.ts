import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaService } from 'src/services/prisma/prisma.service';
import { EncryptService } from 'src/services/encrypt/encrypt.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService, PrismaService, EncryptService],
  exports: [UsersService],
})
export class UsersModule {}
