import { ApiProperty } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class MarkReminderPlanTimeDto {
  @ApiProperty({
    description: 'Medication plan id',
  })
  @IsNotEmpty()
  @IsNumber()
  reminderPlanMedicationPlanId: number;

  @ApiProperty({
    description: 'Medication id',
  })
  @IsNotEmpty()
  @IsNumber()
  reminderPlanMedicationId: number;

  @ApiProperty({
    description: 'The reminder time',
  })
  @IsNotEmpty()
  @IsDateString()
  time: string;
}

export class MarkLocalReminderPlanTimeDto {
  @ApiProperty({
    description: 'Medication plan id',
  })
  @IsNotEmpty()
  @IsNumber()
  localReminderPlanMedicationPlanId: number;

  @ApiProperty({
    description: 'Local medication name',
  })
  @IsNotEmpty()
  @IsString()
  localReminderPlanLocalMedicationName: string;

  @ApiProperty({
    description: 'The reminder time',
  })
  @IsNotEmpty()
  @IsDateString()
  time: string;
}
