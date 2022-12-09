import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { jwtSecret } from '../utils/constants';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async signup(dto: AuthDto, type: string) {
    const { dummy, password } = dto;
    const foundUser = await this.prisma.userAccount.findUnique({
      where: { dummy },
    });

    if (foundUser) {
      throw new BadRequestException('User already exists');
    }
    const hashedPassword = await this.hashPassword(password);

    const prefix = dummy.substring(0, dummy.indexOf('@'));

    if (type === 'PATIENT') {
      const newPatient = await this.prisma.userAccount.create({
        data: {
          username: prefix,
          phoneNumber: prefix,
          hashedPassword,
          firstName: '',
          lastName: '',
          gender: '',
          dummy,
        },
      });

      return { newPatient, message: 'Patient sign up sucessfully' };
    } else {
      const newUser = await this.prisma.userAccount.create({
        data: {
          username: prefix,
          phoneNumber: '',
          hashedPassword,
          firstName: '',
          lastName: '',
          gender: '',
          dummy,
        },
      });

      return { newUser, message: 'User sign up sucessfully' };
    }
  }

  async signin(dto: AuthDto) {
    const { dummy, password } = dto;

    const foundUser = await this.prisma.userAccount.findUnique({
      where: { dummy },
    });

    if (!foundUser) {
      throw new BadRequestException('Wrong credential');
    }

    const isMatch = await this.comparePasswords({
      password,
      hash: foundUser.hashedPassword,
    });

    if (!isMatch) {
      throw new BadRequestException('Wrong credential');
    }
    const token = await this.signToken({
      id: foundUser.id,
      email: foundUser.email,
    });

    return { token };
  }

  async signout() {
    return '';
  }

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);

    return hashedPassword;
  }

  async comparePasswords(args: { password: string; hash: string }) {
    return await bcrypt.compare(args.password, args.hash);
  }

  async signToken(args: { id: number; email: string }) {
    const payload = args;

    return this.jwt.signAsync(payload, { secret: jwtSecret });
  }
}
