import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import {
  Frequency,
  Gender,
  OperatorAccount,
  PatientAccount,
  Prisma,
  UserRole,
} from '@prisma/client';
import { User } from 'src/decorator/user.decorator';
import { OperatorLocalAuthGuard } from 'src/guard/operator/local-auth.guard';
import { PatientLocalAuthGuard } from 'src/guard/patient/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { CreatePatientDto } from './dto/create-patient.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('operator/register')
  async registerOperator(@Body() createOperatorDto: CreateOperatorDto) {
    console.log(createOperatorDto);
    const { role, username, password, hospitalId } = createOperatorDto;
    if (role === UserRole.DOCTOR) {
      return await this.authService.registerDoctor(
        username,
        password,
        hospitalId,
      );
    }

    if (role === UserRole.HOSPITAL_ADMIN) {
      return await this.authService.registerHospitalAdmin(
        username,
        password,
        hospitalId,
      );
    }
  }

  @Post('operator/login')
  @UseGuards(OperatorLocalAuthGuard)
  async loginOperator(@User() operator: any) {
    return await this.authService.loginOperator(operator);
  }

  @Post('patient/register')
  async registerPatient(@Body() createPatientDto: CreatePatientDto) {
    const { password, phoneNumber } = createPatientDto;
    return await this.authService.registerPatient(phoneNumber, password);
  }

  @Post('patient/login')
  @UseGuards(PatientLocalAuthGuard)
  async loginPatient(@User() patient: any) {
    return await this.authService.loginPatient(patient);
  }
}
