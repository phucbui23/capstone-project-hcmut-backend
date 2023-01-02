import { BadRequestException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class OperatorLocalStrategy extends PassportStrategy(
  Strategy,
  'operator',
) {
  constructor(private readonly authSerivce: AuthService) {
    super({
      usernameField: 'username',
      passwordField: 'password',
    });
  }

  async validate(username: string, password: string) {
    const operator = await this.authSerivce.validateOperator(
      username,
      password,
    );
    if (!operator) {
      throw new BadRequestException('Patient account not exists');
    }

    return operator;
  }
}
