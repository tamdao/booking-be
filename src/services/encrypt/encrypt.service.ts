import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class EncryptService {
  hash(data: string): string {
    return bcrypt.hashSync(data, 10);
  }

  match(data: string, hashedData: string) {
    return bcrypt.compareSync(data, hashedData);
  }
}
