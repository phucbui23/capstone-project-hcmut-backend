import {
  IsNotEmpty,
  IsString,
  IsEmail,
  Length,
  IsMobilePhone,
} from 'class-validator';

export class AuthDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  public dummy: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: 'Password has to have 6-20 characters' })
  public password: string;
}

export class PatientAuthDto {
  @IsNotEmpty()
  @IsMobilePhone('vi-VN')
  public phoneNumber: string;

  @IsNotEmpty()
  @IsString()
  @Length(6, 20, { message: 'Password has to have 6-20 characters' })
  public password: string;
}
