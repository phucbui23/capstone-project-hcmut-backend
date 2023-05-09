import { ApiProperty } from '@nestjs/swagger';
import { IsMobilePhone, IsNotEmpty, Length } from 'class-validator';
import { PROPERTY } from 'src/constant';

export class PatientAuthDto {
  @ApiProperty({
    description: 'Patient account phone number',
    minLength: PROPERTY.PASSWORD.MIN_LENGTH,
    maxLength: PROPERTY.PASSWORD.MAX_LENGTH,
  })
  @IsNotEmpty()
  @IsMobilePhone('vi-VN')
  phoneNumber: string;

  @ApiProperty({
    description: 'Patient account password',
    minLength: PROPERTY.PASSWORD.MIN_LENGTH,
    maxLength: PROPERTY.PASSWORD.MAX_LENGTH,
  })
  @IsNotEmpty()
  @Length(PROPERTY.PASSWORD.MIN_LENGTH, PROPERTY.PASSWORD.MAX_LENGTH)
  password: string;
}
