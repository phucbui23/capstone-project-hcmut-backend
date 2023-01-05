import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { PROPERTY } from 'src/constant';

type OperatorRole = Extract<UserRole, 'DOCTOR' | 'HOSPITAL_ADMIN'>;

export class CreateOperatorDto {
  @ApiProperty({
    description: 'The username of an operator account',
    minLength: PROPERTY.PASSWORD.MIN_LENGTH,
    maxLength: PROPERTY.PASSWORD.MAX_LENGTH,
  })
  @IsNotEmpty()
  @Length(6, 20)
  username: string;

  @ApiProperty({
    description: 'The password of an operator account',
    minLength: PROPERTY.PASSWORD.MIN_LENGTH,
    maxLength: PROPERTY.PASSWORD.MAX_LENGTH,
  })
  @IsNotEmpty()
  @Length(PROPERTY.PASSWORD.MIN_LENGTH, PROPERTY.PASSWORD.MAX_LENGTH)
  password: string;

  @ApiProperty({
    description: 'The hospital name in which the operator works in',
  })
  @IsNotEmpty()
  hospitalId: number;

  @ApiProperty({
    description: 'The role of the operator',
    enum: [UserRole.HOSPITAL_ADMIN, UserRole.DOCTOR],
    enumName: 'OperatorRole',
    default: UserRole.DOCTOR,
  })
  @IsNotEmpty()
  role: OperatorRole;
}
