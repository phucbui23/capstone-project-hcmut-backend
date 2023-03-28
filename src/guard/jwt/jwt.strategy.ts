import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { UserRole } from '@prisma/client';
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

  async validate(payload: {
    sub: number;
    role: UserRole;
    phoneNumber?: string;
    username?: string;
  }) {
    const { sub, role, phoneNumber, username } = payload;
    if (role === 'HOSPITAL_ADMIN' || role === 'DOCTOR') {
      return {
        username,
        role,
        userId: sub,
      };
    }

    return {
      role,
      phoneNumber,
      userId: sub,
    };
  }
}
