import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsMobilePhone, IsNotEmpty, Length } from 'class-validator';
import { PROPERTY } from 'src/constant';

export class CreatePatientDto {
  @ApiProperty({
    description: 'The phone number of a patient account',
  })
  @IsMobilePhone('vi-VN')
  @IsNotEmpty()
  phoneNumber: string;

  @ApiProperty({
    description: 'The password of an operator account',
    minLength: PROPERTY.PASSWORD.MIN_LENGTH,
    maxLength: PROPERTY.PASSWORD.MAX_LENGTH,
  })
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
