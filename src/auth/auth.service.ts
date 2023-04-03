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
      return null;
    }

    const validPassword = await this.authHelper.isPasswordValid(
      password,
      patient.passwordHash,
    );
    if (!validPassword) {
      return null;
    }

    const { passwordHash, ...restPatient } = patient;
    return { ...restPatient };
  }

  async validateOperator(username: string, password: string) {
    const operator = await this.operatorsService.findOne({ username });
    if (!operator) {
      return null;
    }

    if (
      !(await this.authHelper.isPasswordValid(password, operator.passwordHash))
    ) {
      return null;
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
      ...patient,
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
      ...operator,
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
