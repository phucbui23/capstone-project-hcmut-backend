import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { DOCTORS_EXAMPLES } from 'prisma/seed-data/doctors';
import { HOSPITAL_ADMIN_EXAMPLES } from 'prisma/seed-data/hospital-admins';
import { PATIENTS_EXAMPLES } from 'prisma/seed-data/patients';
import { User } from 'src/decorator/user.decorator';
import { OperatorLocalAuthGuard } from 'src/guard/operator/local-auth.guard';
import { PatientLocalAuthGuard } from 'src/guard/patient/local-auth.guard';
import { AuthService } from './auth.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { OperatorAuthDto } from './dto/operator-auth.dto';
import { PatientAuthDto } from './dto/patient-auth.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('operator/register')
  async registerOperator(@Body() createOperatorDto: CreateOperatorDto) {
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

  @ApiBody({
    type: OperatorAuthDto,
    description: 'Login by an operator account',
    examples: { ...DOCTORS_EXAMPLES, ...HOSPITAL_ADMIN_EXAMPLES },
  })
  @Post('operator/login')
  @UseGuards(OperatorLocalAuthGuard)
  async loginOperator(@User() operator: any) {
    return await this.authService.loginOperator(operator);
  }

  @Post('patient/register')
  async registerPatient(@Body() patientAuthDto: PatientAuthDto) {
    const { password, phoneNumber } = patientAuthDto;
    return await this.authService.registerPatient(phoneNumber, password);
  }

  @ApiBody({
    type: PatientAuthDto,
    description: 'Login by a patient account',
    examples: PATIENTS_EXAMPLES,
  })
  @Post('patient/login')
  @UseGuards(PatientLocalAuthGuard)
  async loginPatient(@User() patient: any) {
    return await this.authService.loginPatient(patient);
  }
}