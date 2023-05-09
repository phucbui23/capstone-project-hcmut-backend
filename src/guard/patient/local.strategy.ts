import { Injectable } from '@nestjs/common';
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
    const patient = await this.authSerivce.validatePatient(
      phoneNumber,
      password,
    );
    return patient;
  }
}
