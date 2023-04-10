import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsNotEmpty, IsString } from 'class-validator';
type OperatorRole = Extract<UserRole, 'DOCTOR' | 'HOSPITAL_ADMIN'>;

export class CreateOperatorDto {
  @ApiProperty({
    description: 'Operator first name',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'Operator last name',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

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
