import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsDate,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreatePatientDto {
  @ApiProperty({
    description: 'Patient insurance number',
  })
  @IsOptional()
  @IsString()
  insuranceNumber: string;

  @ApiProperty({
    description: 'Patient occupation',
  })
  @IsOptional()
  @IsString()
  occupation: string;

  @ApiProperty({
    description: 'Patient phone number',
  })
  @IsPhoneNumber('VN')
  phoneNumber: string;

  @ApiProperty({
    description: 'Patient email',
  })
  @IsOptional()
  @IsString()
  email: string;

  @ApiProperty({
    description: 'Patient first name',
  })
  @IsString()
  firstName: string;

  @ApiProperty({
    description: 'Patient last name',
  })
  @IsString()
  lastName: string;

  @ApiProperty({
    description: 'Patient gender',
  })
  @IsEnum(Gender)
  gender: Gender;

  @ApiProperty({
    description: 'Patient address',
  })
  @IsOptional()
  @IsString()
  address: string;

  @ApiProperty({
    description: 'Patient social security number',
  })
  @IsOptional()
  @IsString()
  socialSecurityNumber: string;

  @ApiProperty({
    description: 'Patient nationality',
  })
  @IsOptional()
  @IsString()
  nationality: string;

  @ApiProperty({
    description: 'Patient birthday',
  })
  @IsOptional()
  @IsDate()
  birthday: Date;
}
