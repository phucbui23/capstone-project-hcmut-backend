import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthHelper } from 'src/auth/auth.helper';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class OperatorLocalStrategy extends PassportStrategy(
  Strategy,
  'operator',
) {
  constructor(
    private readonly authSerivce: AuthService,
    private readonly authHelper: AuthHelper,
  ) {
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
    return operator;
  }
}
