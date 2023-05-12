import { BadRequestException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';
import { AuthHelper } from 'src/auth/auth.helper';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserAccountIncludeFields } from './constants';
import {
  UpdateDoctorAccountDto,
  UpdateOperatorAccountDto,
  UpdatePasswordDto,
  UpdatePatientAccountDto,
} from './dto/user-account.dto';

@Injectable()
export class UserAccountsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly authHelper: AuthHelper,
  ) {}

  async findAll(
    page: number,
    perPage: number,
    field: string,
    order: string,
    keyword: string,
  ) {
    const paginate = createPaginator({ perPage });
    if (keyword.length > 0) {
      return await paginate(
        this.prismaService.userAccount,
        {
          where: {
            OR: [
              {
                address: { contains: keyword, mode: 'insensitive' },
                code: { contains: keyword, mode: 'insensitive' },
                email: { contains: keyword, mode: 'insensitive' },
                firstName: { contains: keyword, mode: 'insensitive' },
                lastName: { contains: keyword, mode: 'insensitive' },
                nationality: {
                  contains: keyword,
                  mode: 'insensitive',
                },
                socialSecurityNumber: {
                  contains: keyword,
                  mode: 'insensitive',
                },
              },
            ],
          },
          include: UserAccountIncludeFields,
          orderBy: {
            [field]: order,
          },
        },
        { page },
      );
    } else
      return await paginate(
        this.prismaService.userAccount,
        {
          include: UserAccountIncludeFields,
          orderBy: {
            [field]: order,
          },
        },
        { page },
      );
  }

  async findOne(where: Prisma.UserAccountWhereUniqueInput) {
    try {
      return await this.prismaService.userAccount.findUniqueOrThrow({
        where,
        include: UserAccountIncludeFields,
      });
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        error: 'No user found',
      });
    }
  }

  async getProfile(code: string) {
    try {
      return await this.prismaService.userAccount.findUniqueOrThrow({
        where: {
          code,
        },
        include: UserAccountIncludeFields,
      });
    } catch (error) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        error: 'No user found',
      });
    }
  }

  async updatePassword(code: string, updatePasswordDto: UpdatePasswordDto) {
    const { newPassword, oldPassword } = updatePasswordDto;

    const user = await this.prismaService.userAccount.findUnique({
      where: {
        code,
      },
    });

    if (!user) {
      throw new BadRequestException({
        status: HttpStatus.NOT_FOUND,
        error: 'No user found',
      });
    }

    const validPassword = await this.authHelper.isPasswordValid(
      oldPassword,
      user.passwordHash,
    );

    if (!validPassword) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: 'Wrong password',
      });
    }

    const newPasswordHashed = await this.authHelper.encodePassword(newPassword);

    if (user.passwordHash === newPasswordHashed) {
      throw new BadRequestException({
        status: HttpStatus.BAD_REQUEST,
        error: "New password can't be the same as old password",
      });
    }
    await this.prismaService.userAccount.update({
      where: {
        code,
      },
      data: {
        passwordHash: newPasswordHashed,
      },
    });
    return {
      message: 'Password update successfully',
    };
  }

  async update(id: number, data: Prisma.UserAccountUpdateInput) {
    return await this.prismaService.userAccount.update({
      where: { id },
      data,
      include: UserAccountIncludeFields,
    });
  }

  async updateOperator(id: number, data: UpdateOperatorAccountDto) {
    const {
      address,
      birthday,
      email,
      firstName,
      gender,
      lastName,
      nationality,
      socialSecurityNumber,
      phoneNumber,
    } = data;

    return await this.prismaService.userAccount.update({
      where: { id },
      data: {
        address,
        birthday,
        email,
        firstName,
        gender,
        lastName,
        nationality,
        socialSecurityNumber,
        operatorAccount: {
          update: { phoneNumber },
        },
      },
      include: UserAccountIncludeFields,
    });
  }

  async updatePatient(id: number, data: UpdatePatientAccountDto) {
    const {
      address,
      birthday,
      email,
      firstName,
      gender,
      lastName,
      nationality,
      socialSecurityNumber,
      insuranceNumber,
      occupation,
    } = data;

    return await this.prismaService.userAccount.update({
      where: { id },
      data: {
        address,
        birthday,
        email,
        firstName,
        gender,
        lastName,
        nationality,
        socialSecurityNumber,
        patientAccount: { update: { insuranceNumber, occupation } },
      },
      include: UserAccountIncludeFields,
    });
  }

  async updateDoctor(id: number, data: UpdateDoctorAccountDto) {
    const {
      address,
      birthday,
      email,
      firstName,
      gender,
      lastName,
      nationality,
      socialSecurityNumber,
      faculty,
      yearOfExperience,
    } = data;
    return await this.prismaService.userAccount.update({
      where: { id },
      data: {
        address,
        birthday,
        email,
        firstName,
        gender,
        lastName,
        nationality,
        socialSecurityNumber,
        operatorAccount: {
          update: {
            doctorAccount: {
              update: {
                faculty,
                yearOfExperience,
              },
            },
          },
        },
      },
      include: UserAccountIncludeFields,
    });
  }

  async remove(id: number) {
    return await this.prismaService.userAccount.delete({ where: { id } });
  }
}
