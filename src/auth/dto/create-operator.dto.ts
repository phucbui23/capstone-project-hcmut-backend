import { IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateOperatorAccount {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsNotEmpty()
  hospitalName: string;

  @IsString()
  role: 'Hospital admin' | 'Doctor';
}
