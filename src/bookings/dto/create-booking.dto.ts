import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class CreateBookingDto {
  @IsDate()
  @Type(() => Date)
  checkin: Date;

  @IsDate()
  @Type(() => Date)
  checkout: Date;

  @IsNotEmpty()
  roomId: string;
}
