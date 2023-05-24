import { BadRequestException, Injectable } from '@nestjs/common';
import { DoctorsService } from 'src/doctors/doctors.service';
import { HospitalAdminsService } from 'src/hospital-admins/hospital-admins.service';
import { OperatorsService } from 'src/operators/operators.service';
import { PatientsService } from 'src/patients/patients.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthHelper } from './auth.helper';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly patientsService: PatientsService,
    private readonly doctorsService: DoctorsService,
    private readonly operatorsService: OperatorsService,
    private readonly hospitalAdminsService: HospitalAdminsService,
    private readonly authHelper: AuthHelper,
  ) {}

  async validatePatient(phoneNumber: string, password: string) {
    const patient = await this.patientsService.findOne({ phoneNumber });
    if (!patient) {
      throw new BadRequestException('Patient account not exist');
    }

    if (
      !(await this.authHelper.isPasswordValid(password, patient.passwordHash))
    ) {
      throw new BadRequestException('Wrong password');
    }

    const { passwordHash, ...restPatient } = patient;
    return { ...restPatient };
  }

  async validateOperator(username: string, password: string) {
    const operator = await this.operatorsService.findOne({ username });
    if (!operator) {
      throw new BadRequestException('Operator account not exist');
    }

    if (
      !(await this.authHelper.isPasswordValid(password, operator.passwordHash))
    ) {
      throw new BadRequestException('Wrong password');
    }

    const { passwordHash, ...restOperator } = operator;

    return { ...restOperator };
  }
  // Data returned from the local guard
  async loginPatient(patient: any) {
    const payload = {
      sub: patient.id,
      phoneNumber: patient.patientAccount.phoneNumber,
      role: patient.role.name,
    };
    const token = this.authHelper.generateToken(payload);

    return {
      token,
      id: patient.id,
      code: patient.code,
      email: patient.email,
      firstName: patient.firstName,
      lastName: patient.lastName,
      gender: patient.gender,
      address: patient.address,
      socialSecurityNumber: patient.socialSecurityNumber,
      nationality: patient.nationality,
      birthday: patient.birthday,
      lastActive: patient.lastActive,
      createdAt: patient.createdAt,
      updatedAt: patient.updatedAt,
      roleId: patient.roleId,
      attachment: patient.attachment,
      role: {
        id: patient.role.id,
        name: patient.role.name,
        description: patient.role.description,
      },
      patientAccount: {
        insuranceNumber: patient.patientAccount.insuranceNumber,
        occupation: patient.patientAccount.occupation,
        userAccountId: patient.patientAccount.userAccountId,
        phoneNumber: patient.patientAccount.phoneNumber,
        username: patient.patientAccount.username,
      },
    };
  }
  // Data returned from the local guard
  async loginOperator(operator: any) {
    const payload = {
      sub: operator.id,
      username: operator.operatorAccount.username,
      role: operator.role.name,
    };
    const token = this.authHelper.generateToken(payload);

    return {
      token,
      id: operator.id,
      code: operator.code,
      email: operator.email,
      firstName: operator.firstName,
      lastName: operator.lastName,
      gender: operator.gender,
      address: operator.address,
      socialSecurityNumber: operator.socialSecurityNumber,
      nationality: operator.nationality,
      birthday: operator.birthday,
      lastActive: operator.lastActive,
      createdAt: operator.createdAt,
      updatedAt: operator.updatedAt,
      roleId: operator.roleId,
      attachment: operator.attachment,
      role: {
        id: operator.role.id,
        name: operator.role.name,
        description: operator.role.description,
      },
      operatorAccount: {
        userAccountId: operator.operatorAccount.userAccountId,
        username: operator.operatorAccount.username,
        phoneNumber: operator.operatorAccount.phoneNumber,
        hospitalId: operator.operatorAccount.hospitalId,
        hospital: {
          id: operator.operatorAccount.hospital.id,
          name: operator.operatorAccount.hospital.name,
          description: operator.operatorAccount.hospital.description,
        },
        doctorAccount: operator.operatorAccount.doctorAccount
          ? {
              operatorAccountId:
                operator.operatorAccount.doctorAccount.operatorAccountId,
              faculty:
                operator.operatorAccount.doctorAccount.operatorAccountId
                  .faculty,
              yearOfExperience:
                operator.operatorAccount.doctorAccount.yearOfExperience,
            }
          : null,
        hospitalAdminAccount: operator.operatorAccount.hospitalAdminAccount,
      },
    };
  }

  async registerPatient(phoneNumber: string, password: string) {
    const existingPatient = await this.patientsService.findOne({ phoneNumber });
    if (existingPatient) {
      throw new BadRequestException('Patient already exists');
    }

    return await this.patientsService.createOne(
      phoneNumber,
      await this.authHelper.encodePassword(password),
    );
  }

  async registerDoctor(
    firstName: string,
    lastName: string,
    hospitalId: number,
  ) {
    const username =
      `${firstName}` +
      '.' +
      `${lastName}` +
      '.' +
      `${(await this.prismaService.userAccount.count({})) + 1}`;
    const existingDoctor = await this.doctorsService.findOne({ username });

    if (existingDoctor) {
      throw new BadRequestException('Doctor already exists');
    }

    return await this.doctorsService.createOne(
      firstName,
      lastName,
      username.replace(/\s+/g, ''),
      await this.authHelper.encodePassword(
        process.env.DOCTOR_PASSWORD || 'default',
      ),
      hospitalId,
    );
  }

  async registerHospitalAdmin(
    firstName: string,
    lastName: string,
    hospitalId: number,
  ) {
    const username =
      `${firstName}` +
      '.' +
      `${lastName}` +
      '.' +
      `${(await this.prismaService.userAccount.count({})) + 1}`;
    const existingHospitalAdmin = await this.hospitalAdminsService.findOne({
      username,
    });

    if (existingHospitalAdmin) {
      throw new BadRequestException('Hospital admin already exists');
    }
    return await this.hospitalAdminsService.createOne(
      firstName,
      lastName,
      username.replace(/\s+/g, ''),
      await this.authHelper.encodePassword(
        process.env.HOSPITAL_ADMIN_PASSWORD || 'default',
      ),
      hospitalId,
    );
  }
}
