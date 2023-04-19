import { Injectable } from '@nestjs/common';
import { Prisma, UserRole } from '@prisma/client';
import { createPaginator } from 'prisma-pagination';

import { collection, doc, setDoc } from 'firebase/firestore';
import { FirebaseService } from 'src/firebase/firebase.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { patientIncludeFields, patientList } from './constants';

@Injectable()
export class PatientsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly firebaseService: FirebaseService,
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
            AND: {
              role: { name: { equals: UserRole.PATIENT } },
              OR: [
                {
                  code: {
                    contains: keyword,
                  },
                },
                {
                  email: {
                    contains: keyword,
                  },
                },
                {
                  firstName: {
                    contains: keyword,
                  },
                },
                {
                  lastName: {
                    contains: keyword,
                  },
                },
                {
                  address: {
                    contains: keyword,
                  },
                },
                {
                  socialSecurityNumber: {
                    contains: keyword,
                  },
                },
                {
                  patientAccount: {
                    OR: [
                      {
                        phoneNumber: {
                          contains: keyword,
                        },
                      },
                      {
                        insuranceNumber: {
                          contains: keyword,
                        },
                      },
                      {
                        username: {
                          contains: keyword,
                        },
                      },
                    ],
                  },
                },
              ],
            },
          },
          select: patientList,
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
          where: {
            role: { name: { equals: UserRole.PATIENT } },
          },
          select: patientList,
          orderBy: {
            [field]: order,
          },
        },
        { page },
      );
  }

  async findOne(where: Prisma.PatientAccountWhereUniqueInput) {
    const patient = await this.prismaService.patientAccount.findUnique({
      where,
      select: { userAccountId: true },
    });
    if (!patient) {
      return null;
    }
    const { userAccountId } = patient;

    const user = await this.prismaService.userAccount.findUnique({
      where: { id: userAccountId },
      include: patientIncludeFields,
    });

    return user;
  }

  async createOne(phoneNumber: string, password: string) {
    const patient = await this.prismaService.userAccount.create({
      data: {
        passwordHash: password,
        role: { connect: { name: UserRole.PATIENT } },
        patientAccount: {
          create: {
            phoneNumber,
          },
        },
      },
      include: patientIncludeFields,
    });

    // create user on firestore
    const { code, firstName, lastName } = patient;
    const displayName = `${firstName}` + ' ' + `${lastName}`;

    const userData = {
      id: code,
      displayName: displayName,
      phoneNumber: phoneNumber,
      photoUrl: '',
      username: '',
      rooms: [],
      role: 'PATIENT',
    };

    const newUserRef = await doc(
      collection(this.firebaseService.firestoreRef, 'users'),
      code,
    );
    await setDoc(newUserRef, userData);

    return patient;
  }

  async deleteOne(where: Prisma.PatientAccountWhereUniqueInput) {
    const deletePatient = await this.prismaService.patientAccount.delete({
      where,
    });
    const deleteUser = await this.prismaService.userAccount.delete({
      where: { id: deletePatient.userAccountId },
    });

    return 'Patient deleted';
  }

  async updateOne(params: {
    where: Prisma.UserAccountWhereUniqueInput;
    data: Prisma.UserAccountUpdateInput;
  }) {
    const { where, data } = params;
    return await this.prismaService.userAccount.update({
      where,
      data,
      include: patientIncludeFields,
    });
  }
}
