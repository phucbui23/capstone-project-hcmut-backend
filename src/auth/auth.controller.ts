import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { OperatorAccount, PatientAccount } from '@prisma/client';
import { User } from 'src/decorator/user.decorator';
import { OperatorLocalAuthGuard } from 'src/guard/operator/local-auth.guard';
import { PatientLocalAuthGuard } from 'src/guard/patient/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateOperatorAccount } from './dto/create-operator.dto';
import { CreatePatientAccount } from './dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('operator/register')
  async registerOperator(@Body() createOperatorAccount: CreateOperatorAccount) {
    const { role, username, password, hospitalName } = createOperatorAccount;
    if (role === 'Doctor') {
      return await this.authService.registerDoctor(
        username,
        password,
        hospitalName,
      );
    }

    if (role === 'Hospital admin') {
      return await this.authService.registerHospitalAdmin(
        username,
        password,
        hospitalName,
      );
    }
  }

  @Post('operator/login')
  @UseGuards(OperatorLocalAuthGuard)
  async loginOperator(@User() operator: OperatorAccount) {
    return await this.authService.loginOperator(operator);
  }

  @Post('patient/register')
  async registerPatient(@Body() createPatientAccount: CreatePatientAccount) {
    const { password, phoneNumber } = createPatientAccount;
    return await this.authService.registerPatient(phoneNumber, password);
  }

  @Post('patient/login')
  @UseGuards(PatientLocalAuthGuard)
  async loginPatient(@User() patient: PatientAccount) {
    return await this.authService.loginPatient(patient);
  }
}
