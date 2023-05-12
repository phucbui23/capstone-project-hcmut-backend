import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class CreateDoctorManagesPatientDto {
  @ApiProperty({
    description: "The doctor's id",
  })
  @IsNotEmpty()
  doctorId: number;

  @ApiProperty({
    description: "The patient's id",
  })
  @IsNotEmpty()
  patientId: number;
}
