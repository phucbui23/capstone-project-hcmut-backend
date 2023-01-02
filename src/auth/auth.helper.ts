import * as bcrypt from 'bcrypt';
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthHelper {
  constructor(private readonly jwtService: JwtService) {}

  generateToken(payload: any) {
    return {
      accessToken: this.jwtService.sign(payload),
    };
  }

  async encodePassword(password: string) {
    return await bcrypt.hash(password, process.env.BCRYPT_SALT);
  }

  async isPasswordValid(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }
}
