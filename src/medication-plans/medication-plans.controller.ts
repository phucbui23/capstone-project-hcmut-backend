import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiProperty, ApiTags, ApiExtraModels } from '@nestjs/swagger';
import { Frequency, Prisma } from '@prisma/client';
import { Transform, Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { MedicationPlansService } from './medication-plans.service';

class ReminderPlanTime {
  @ApiProperty({
    default: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  dosage: number = 1;

  @ApiProperty({})
  @IsNotEmpty()
  time: string;

  @ApiProperty({})
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  sentAt?: Date;
}

class ReminderPlan {
  @ApiProperty({
    default: 1,
  })
  @IsOptional()
  interval: number = 1;

  @ApiProperty({
    default: [Array.from(Array(7).keys())],
  })
  @IsArray()
  @ArrayMinSize(1)
  @IsOptional()
  selectedDays?: number[] = Array.from(Array(7).keys());

  @ApiProperty({})
  @IsNotEmpty()
  @IsEnum(Frequency)
  frequency: Frequency;

  @ApiProperty({})
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startDate: Date;

  @ApiProperty({})
  @IsNotEmpty()
  medicationId: number;

  @ApiProperty({})
  @IsOptional()
  note?: string;

  @ApiProperty({})
  @IsOptional()
  localMedicationName?: string;

  @ApiProperty({})
  @IsOptional()
  stock?: number;

  @ApiProperty({})
  @Type(() => Date)
  @IsOptional()
  @IsDate()
  endDate?: Date;

  @ApiProperty({})
  @IsNotEmpty()
  @IsArray()
  @Type(() => ReminderPlanTime)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  reminderPlanTime: ReminderPlanTime[];
}

@ApiExtraModels(ReminderPlan)
export class CreateMedicationPlanDto {
  @ApiProperty({})
  @IsNotEmpty()
  patientId: number;

  @ApiProperty({})
  @IsNotEmpty()
  name: string;

  @ApiProperty({})
  @IsNotEmpty()
  @Type(() => ReminderPlan)
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  remindersPlans: ReminderPlan[];

  @ApiProperty({})
  @IsOptional()
  note?: string;

  @ApiProperty({})
  @IsOptional()
  doctorId?: number;
}

@ApiTags('medication plans')
@Controller('medication-plans')
export class MedicationPlansController {
  constructor(
    private readonly medicationPlansService: MedicationPlansService,
  ) {}

  @Get()
  async findAll() {
    return this.medicationPlansService.findAll();
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async createOne(
    @Body()
    createDto: CreateMedicationPlanDto,
  ) {
    console.log(createDto);
    return await this.medicationPlansService.createOne(createDto);
  }

  @Delete(':id')
  async deleteOne(@Param('id', ParseIntPipe) id: number) {
    return await this.medicationPlansService.deleteOne({ id });
  }
}
