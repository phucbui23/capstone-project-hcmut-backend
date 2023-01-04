import { Prisma } from '@prisma/client';
import { IsMobilePhone, IsNotEmpty, Length } from 'class-validator';

export class CreatePatientAccount {
  @IsMobilePhone('vi-VN')
  phoneNumber?: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
