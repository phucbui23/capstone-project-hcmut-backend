import { Injectable } from '@nestjs/common';
import { PatientsService } from 'src/patients/patients.service';
import { DoctorsService } from 'src/doctors/doctors.service';
import { OperatorAccount, PatientAccount } from '@prisma/client';
import { OperatorsService } from 'src/operators/operators.service';
import { HospitalAdminsService } from 'src/hospital-admins/hospital-admins.service';
import { AuthHelper } from './auth.helper';

@Injectable()
export class AuthService {
  constructor(
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

    if (
      !(await this.authHelper.isPasswordValid(
        password,
        patient.userAccount.passwordHash,
      ))
    ) {
      return null;
    }

    const {
      userAccount: { passwordHash, ...restUserAccount },
      ...restPatient
    } = patient;
    return { ...restPatient, ...restUserAccount };
  }

  async validateOperator(username: string, password: string) {
    const operator = await this.operatorsService.findOne({ username });
    if (!operator) {
      return null;
    }

    if (
      !(await this.authHelper.isPasswordValid(
        password,
        operator.userAccount.passwordHash,
      ))
    ) {
      return null;
    }

    const {
      userAccount: { passwordHash, ...restUserAccount },
      ...restOperator
    } = operator;

    return { ...restOperator, ...restUserAccount };
  }

  async loginPatient(patient: PatientAccount) {
    const payload = {
      sub: patient.userAccountId,
      phoneNumber: patient.phoneNumber,
    };

    return this.authHelper.generateToken(payload);
  }

  async loginOperator(operator: OperatorAccount) {
    const payload = {
      sub: operator.userAccountId,
      username: operator.username,
    };

    return this.authHelper.generateToken(payload);
  }

  async registerPatient(phoneNumber: string, password: string) {
    return await this.patientsService.createOne(
      phoneNumber,
      await this.authHelper.encodePassword(password),
    );
  }

  async registerDoctor(
    username: string,
    password: string,
    hospitalName: string,
  ) {
    return await this.doctorsService.createOne(
      username,
      await this.authHelper.encodePassword(password),
      hospitalName,
    );
  }

  async registerHospitalAdmin(
    username: string,
    password: string,
    hospitalName: string,
  ) {
    return await this.hospitalAdminsService.createOne(
      username,
      await this.authHelper.encodePassword(password),
      hospitalName,
    );
  }
}
