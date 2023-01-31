import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { IsNotEmpty } from 'class-validator';
import { OperatorAuthDto } from './operator-auth.dto';

type OperatorRole = Extract<UserRole, 'DOCTOR' | 'HOSPITAL_ADMIN'>;

export class CreateOperatorDto extends OperatorAuthDto {
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
