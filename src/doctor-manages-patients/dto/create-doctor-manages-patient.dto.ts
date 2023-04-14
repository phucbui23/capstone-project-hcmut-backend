import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDoctorManagesPatientDto {
  @ApiProperty({})
  @IsNotEmpty()
  doctorId: number;

  @ApiProperty({})
  @IsNotEmpty()
  patientId: number;
}
