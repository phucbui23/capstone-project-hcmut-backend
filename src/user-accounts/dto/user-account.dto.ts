import { ApiProperty } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import {
  IsDate,
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
  })
  @IsOptional()
  firstName: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  lastName: string;

  @ApiProperty({
    required: false,
    enum: [Gender],
  })
  @IsOptional()
  gender: Gender;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  address: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  socialSecurityNumber: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  nationality: string;

  @ApiProperty({
    required: false,
  })
  @IsDate()
  @IsOptional()
  birthday: Date;
}

export class UpdateOperatorAccountDto extends UpdateUserAccountDto {
  @ApiProperty({
    required: false,
  })
  username: string;

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
  })
  @IsOptional()
  faculty: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  yearOfExperience: number;
}

export class UpdatePatientAccountDto extends UpdateUserAccountDto {
  @ApiProperty({
    required: false,
  })
  @IsOptional()
  insuranceNumber: string;

  @ApiProperty({
    required: false,
  })
  @IsOptional()
  occupation: string;
}

export class UpdatePasswordDto {
  @ApiProperty({
    description: 'Patient account password',
    minLength: PROPERTY.PASSWORD.MIN_LENGTH,
    maxLength: PROPERTY.PASSWORD.MAX_LENGTH,
  })
  @IsNotEmpty()
  @Length(PROPERTY.PASSWORD.MIN_LENGTH, PROPERTY.PASSWORD.MAX_LENGTH)
  oldPassword: string;

  @ApiProperty({
    description: 'Patient account password',
    minLength: PROPERTY.PASSWORD.MIN_LENGTH,
    maxLength: PROPERTY.PASSWORD.MAX_LENGTH,
  })
  @IsNotEmpty()
  @Length(PROPERTY.PASSWORD.MIN_LENGTH, PROPERTY.PASSWORD.MAX_LENGTH)
  newPassword: string;
}
