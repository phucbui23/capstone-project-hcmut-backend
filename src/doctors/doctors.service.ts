import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';

import { collection, doc, setDoc } from 'firebase/firestore';
import { createPaginator } from 'prisma-pagination';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { doctorFieldIncludes } from './constants';

const doctorResponse = Prisma.validator<Prisma.UserAccountArgs>()({
  include: doctorFieldIncludes as object,
});

export type DoctorResponse = Prisma.UserAccountGetPayload<
  typeof doctorResponse
>;
@Injectable()
export class DoctorsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
  ) {}

  async createOne(
    firstName: string,
    lastName: string,
    username: string,
    password: string,
    hospitalId: number,
  ) {
    const doctor = await this.prismaService.userAccount.create({
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        passwordHash: password,
        role: { connect: { name: UserRole.DOCTOR } },
        operatorAccount: {
          create: {
            username,
            hospital: { connect: { id: hospitalId } },
            doctorAccount: {
              create: {},
            },
          },
        },
      },
      include: doctorFieldIncludes,
    });

    // create user on firestore
    const { code } = doctor;
    const displayName = `${firstName.trim()}` + ' ' + `${lastName.trim()}`;

    const userData = {
      id: code,
      displayName: displayName,
      phoneNumber: '',
      photoUrl: '',
      username: username,
      rooms: [],
      role: 'DOCTOR',
    };

    const newUserRef = doc(
      collection(this.firebaseService.firestoreRef, 'users'),
      code,
    );
    await setDoc(newUserRef, userData);

    return doctor;
  }

  async findOne(where: Prisma.OperatorAccountWhereUniqueInput) {
    const operator = await this.prismaService.operatorAccount.findUnique({
      where,
      select: { userAccountId: true },
    });
    if (!operator) {
      return null;
    }
    const { userAccountId } = operator;

    const user = await this.prismaService.userAccount.findFirst({
      where: { roleId: 3, id: userAccountId },
      include: doctorFieldIncludes,
    });

    return user;
  }

  async findAll(page: number, perPage: number, field: string, order: string) {
    const paginate = createPaginator({ perPage });

    return await paginate(
      this.prismaService.userAccount,
      {
        where: {
          role: { name: { equals: UserRole.DOCTOR } },
        },
        include: doctorFieldIncludes,
        orderBy: {
          [field]: order,
        },
      },
      { page },
    );

    // return await this.prismaService.userAccount.findMany({
    //   where: {
    //     role: { name: { equals: UserRole.DOCTOR } },
    //   },
    //   include: doctorFieldIncludes,
    //   orderBy: {
    //     [field]: order,
    //   },
    // });
  }

  async deleteOne(where: Prisma.DoctorAccountWhereUniqueInput) {
    const deletedDoctor = await this.prismaService.doctorAccount.delete({
      where,
    });
    const deletedOperator = await this.prismaService.operatorAccount.delete({
      where: { userAccountId: deletedDoctor.operatorAccountId },
    });

    await this.prismaService.userAccount.delete({
      where: { id: deletedOperator.userAccountId },
    });

    return 'Deleted';
  }
}
