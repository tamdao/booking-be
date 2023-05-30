import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SkipAuth } from 'src/auth/skip-auth.decorator';
import { EncryptService } from 'src/services/encrypt/encrypt.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly encryptService: EncryptService,
  ) {}

  @SkipAuth()
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.findOne({
      email: createUserDto.email,
    });

    if (user) {
      throw new BadRequestException('User already exist');
    }

    const hasPassword = this.encryptService.hash(createUserDto.password);

    return this.usersService
      .create({
        email: createUserDto.email,
        name: createUserDto.name,
        password: hasPassword,
      })
      .then((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
      }));
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne({ id }).then((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
    }));
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService
      .update({ where: { id }, data: updateUserDto })
      .then((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
      }));
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove({ id }).then((user) => ({
      id: user.id,
      email: user.email,
      name: user.name,
    }));
  }
}
