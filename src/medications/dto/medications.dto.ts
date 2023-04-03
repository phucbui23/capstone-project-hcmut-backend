import { ApiProperty } from '@nestjs/swagger';

export class CreateMedicationDto {
  @ApiProperty({
    description: 'Medication code',
  })
  code: string;

  @ApiProperty({
    description: 'Medication code',
  })
  name: string;

  @ApiProperty({
    description: 'Medication code',
    required: false,
  })
  description: string;
}
