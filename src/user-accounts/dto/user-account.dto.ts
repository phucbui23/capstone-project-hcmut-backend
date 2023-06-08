import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsDateString,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  Length,
} from 'class-validator';
import { PROPERTY } from 'src/constant';

export class UpdateUserAccountDto {
  @ApiProperty({
    description: "User's email",
    required: false,
  })
  @IsEmail()
  @IsOptional()
  email: string;

  @ApiProperty({
    required: false,
    description: 'First name',
  })
  @IsOptional()
  firstName: string;

  @ApiProperty({
    required: false,
    description: 'Last name',
  })
  @IsOptional()
  lastName: string;

  @ApiProperty({
    required: false,
    enum: Gender,
    description: 'Gender',
  })
  @IsOptional()
  gender: Gender;

  @ApiProperty({
    required: false,
    description: 'Address',
  })
  @IsOptional()
  address: string;

  @ApiProperty({
    required: false,
    description: 'Social security number',
  })
  @IsOptional()
  socialSecurityNumber: string;

  @ApiProperty({
    required: false,
    description: 'Nationality',
  })
  @IsOptional()
  nationality: string;

  @ApiProperty({
    required: false,
    description: 'Date of birth',
  })
  @IsDateString()
  @IsOptional()
  birthday: Date;
}

export class UpdateOperatorAccountDto extends UpdateUserAccountDto {
  // @ApiProperty({
  //   required: false,
  // })
  // username: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  @IsPhoneNumber('VN')
  phoneNumber: string;

  // @ApiProperty({
  //   required: false,
  // })
  // @IsOptional()
  // hospitalId: number;
}

export class UpdateDoctorAccountDto extends UpdateUserAccountDto {
  @ApiProperty({
    required: false,
    description: 'Faculty',
  })
  @IsOptional()
  faculty: string;

  @ApiProperty({
    required: false,
    description: 'Year of experience',
  })
  @IsOptional()
  yearOfExperience: number;
}

export class UpdatePatientAccountDto extends UpdateUserAccountDto {
  @ApiProperty({
    required: false,
    description: 'Insurance number',
  })
  @IsOptional()
  insuranceNumber: string;

  @ApiProperty({
    description: 'Occupation',
    required: false,
  })
  @IsOptional()
  occupation: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Old account password',
    minLength: PROPERTY.PASSWORD.MIN_LENGTH,
    maxLength: PROPERTY.PASSWORD.MAX_LENGTH,
  })
  @IsNotEmpty()
  @Length(PROPERTY.PASSWORD.MIN_LENGTH, PROPERTY.PASSWORD.MAX_LENGTH)
  oldPassword: string;

  @ApiProperty({
    description: 'New account password',
    minLength: PROPERTY.PASSWORD.MIN_LENGTH,
    maxLength: PROPERTY.PASSWORD.MAX_LENGTH,
  })
  @IsNotEmpty()
  @Length(PROPERTY.PASSWORD.MIN_LENGTH, PROPERTY.PASSWORD.MAX_LENGTH)
  newPassword: string;
}
