import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, Length } from 'class-validator';
import { PROPERTY } from 'src/constant';

export class OperatorAuthDto {
  @ApiProperty({
    description: 'Operator account username',
    minLength: PROPERTY.PASSWORD.MIN_LENGTH,
    maxLength: PROPERTY.PASSWORD.MAX_LENGTH,
  })
  @IsNotEmpty()
  @Length(6, 20)
  username: string;

  @ApiProperty({
    description: 'Operator account password',
    minLength: PROPERTY.PASSWORD.MIN_LENGTH,
    maxLength: PROPERTY.PASSWORD.MAX_LENGTH,
  })
  @IsNotEmpty()
  @Length(PROPERTY.PASSWORD.MIN_LENGTH, PROPERTY.PASSWORD.MAX_LENGTH)
  password: string;
}
