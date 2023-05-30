import { IsInt, IsNotEmpty, Max, Min } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  description: string;

  @IsNotEmpty()
  image: string;

  @IsInt()
  @Min(1)
  @Max(10)
  quantity: number;

  @IsInt()
  @Min(0)
  price: number;
}
