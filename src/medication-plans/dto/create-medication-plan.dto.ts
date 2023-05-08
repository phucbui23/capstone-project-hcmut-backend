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
    default: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  dosage: number = 1;

  @ApiProperty({
    example: '18:00',
  })
  @IsNotEmpty()
  time: string;

  @ApiProperty({
    required: false,
  })
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  sentAt?: Date;
}

class LocalReminderPlan {
  @ApiProperty({
    default: 1,
    required: false,
  })
  @IsNumber()
  @Min(1)
  @Max(30)
  @IsOptional()
  interval: number = 1;

  @ApiProperty({
    default: [Array.from(Array(7).keys())],
    required: false,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  selectedDays?: number[] = Array.from(Array(7).keys());

  @ApiProperty({
    enum: Frequency,
  })
  @IsNotEmpty()
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty({})
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  note?: string;

  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  localMedicationName: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  stock?: number;

  @ApiProperty({
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiProperty({
    type: [ReminderPlanTime],
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
  })
  @IsNumber()
  @Min(1)
  @Max(30)
  @IsOptional()
  interval: number = 1;

  @ApiProperty({
    default: [Array.from(Array(7).keys())],
    required: false,
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  selectedDays?: number[] = Array.from(Array(7).keys());

  @ApiProperty({
    enum: Frequency,
  })
  @IsNotEmpty()
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty({})
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({})
  @IsOptional() // TODO: change medicationId to optional
  medicationId: number;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  note?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  localMedicationName?: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  stock?: number;

  @ApiProperty({
    required: false,
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiProperty({
    type: [ReminderPlanTime],
  })
  @IsNotEmpty()
  @IsArray()
  @Type(() => ReminderPlanTime)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  reminderPlanTimes: ReminderPlanTime[];
}

export class CreateMedicationPlanDto {
  @ApiProperty({})
  @IsNotEmpty()
  patientId: number;

  @ApiProperty({})
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    type: [ReminderPlan],
  })
  @IsOptional()
  @Type(() => ReminderPlan)
  @ArrayMinSize(0)
  @ValidateNested({ each: true })
  reminderPlans: ReminderPlan[];

  @ApiProperty({
    type: [LocalReminderPlan],
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

  @ApiProperty({})
  @IsOptional()
  doctorId?: number;
}
