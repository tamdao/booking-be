import { Module } from '@nestjs/common';
import { BookingsModule } from './bookings/bookings.module';
import { RoomsModule } from './rooms/rooms.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { EncryptService } from './services/encrypt/encrypt.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BookingsModule,
    RoomsModule,
    UsersModule,
    AuthModule,
  ],
  providers: [EncryptService],
})
export class AppModule {}
