import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class PatientLocalStrategy extends PassportStrategy(
  Strategy,
  'patient',
) {
  constructor(private readonly authSerivce: AuthService) {
    super({
      usernameField: 'phoneNumber',
      passwordField: 'password',
    });
  }

  async validate(phoneNumber: string, password: string) {
    console.log({ phoneNumber, password });

    const patient = await this.authSerivce.validatePatient(
      phoneNumber,
      password,
    );
    if (!patient) {
      throw new BadRequestException('Patient account not exists');
    }

    return patient;
  }
}
