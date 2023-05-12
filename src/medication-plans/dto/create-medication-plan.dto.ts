import { ApiProperty } from '@nestjs/swagger';
import { Frequency } from '@prisma/client';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

class ReminderPlanTime {
  @ApiProperty({
    description: 'Num of pills to take',
    default: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  dosage: number = 1;

  @ApiProperty({
    description: 'Time of reminder plan',
    example: '18:00',
  })
  @IsNotEmpty()
  time: string;

  @ApiProperty({
    description: 'Sent time',
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  sentAt?: Date;
}

class LocalReminderPlan {
  @ApiProperty({
    description: 'Reminder plan interval',
    default: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(30)
  @IsOptional()
  interval: number = 1;

  @ApiProperty({
    description:
      'Selected days for reminder plan (Sunday - 0, Monday - 1, ...)',
    default: [Array.from(Array(7).keys())],
    required: false,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  selectedDays?: number[] = Array.from(Array(7).keys());

  @ApiProperty({
    enum: Frequency,
    description: 'Frequency of reminder plan',
  })
  @IsNotEmpty()
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty({
    description: 'Reminder plan start date',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'Reminder plan note',
    required: false,
  })
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'Name of outside drug',
    required: true,
    default: 'outside drug',
  })
  @IsNotEmpty()
  localMedicationName: string;

  @ApiProperty({
    description: 'Total num of pills',
    required: false,
  })
  @IsOptional()
  stock?: number;

  @ApiProperty({
    required: false,
    description: 'Reminder plan end date',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiProperty({
    type: [ReminderPlanTime],
    description: 'Time to send reminder',
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => ReminderPlanTime)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  reminderPlanTimes: ReminderPlanTime[];
}

class ReminderPlan {
  @ApiProperty({
    default: 1,
    required: false,
    description: 'Reminder plan interval',
  })
  @IsNumber()
  @Min(1)
  @Max(30)
  @IsOptional()
  interval: number = 1;

  @ApiProperty({
    default: [Array.from(Array(7).keys())],
    required: false,
    description:
      'Selected days for reminder plan (Sunday - 0, Monday - 1, ...)',
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  selectedDays?: number[] = Array.from(Array(7).keys());

  @ApiProperty({
    enum: Frequency,
    description: 'Frequency of reminder plan',
  })
  @IsNotEmpty()
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty({
    description: 'Reminder plan start date',
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    description: 'Medication id in database',
  })
  @IsOptional()
  medicationId: number;

  @ApiProperty({
    required: false,
    description: 'Reminder plan note',
  })
  @IsOptional()
  note?: string;

  @ApiProperty({
    required: false,
    description: 'Total num of pills',
  })
  @IsOptional()
  stock?: number;

  @ApiProperty({
    required: false,
    description: 'Reminder plan end date',
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiProperty({
    type: [ReminderPlanTime],
    description: 'Time to send reminder',
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => ReminderPlanTime)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  reminderPlanTimes: ReminderPlanTime[];
}

export class CreateMedicationPlanDto {
  @ApiProperty({
    description: 'Patient id',
  })
  @IsNotEmpty()
  patientId: number;

  @ApiProperty({
    description: 'Medication plan name',
    default: 'medication plan name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'All reminder plan',
    type: [ReminderPlan],
    required: false,
  })
  @IsOptional()
  @Type(() => ReminderPlan)
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  reminderPlans: ReminderPlan[];

  @ApiProperty({
    description: 'Medication plan note',
    required: false,
  })
  @IsOptional()
  note?: string;

  @ApiProperty({
    description: 'Id of doctor who prescribes',
    required: false,
  })
  @IsOptional()
  doctorId?: number;
}

export class CreateLocalMedicationPlanDto {
  @ApiProperty({
    description: 'Patient id',
  })
  @IsNotEmpty()
  patientId: number;

  @ApiProperty({
    description: 'Medication plan name',
  })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'All reminder plan',
    type: [LocalReminderPlan],
    required: false,
  })
  @IsOptional()
  @Type(() => LocalReminderPlan)
  @ArrayMinSize(0)
  @ArrayMaxSize(1)
  @ValidateNested({ each: true })
  localReminderPlans: LocalReminderPlan[];

  @ApiProperty({
    description: 'Medication plan note',
    required: false,
  })
  @IsOptional()
  note?: string;
}
