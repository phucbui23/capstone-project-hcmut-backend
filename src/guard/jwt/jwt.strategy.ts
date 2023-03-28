import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (payload.username) {
      return {
        userId: payload.sub,
        username: payload.username,
        role: payload.role.name,
      };
    }
    return {
      userId: payload.sub,
      phoneNumber: payload.phoneNumber,
      role: payload.role.name,
    };
  }
}
