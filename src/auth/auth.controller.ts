import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';

import { DOCTORS_EXAMPLES } from 'prisma/seed-data/doctors';
import { HOSPITAL_ADMIN_EXAMPLES } from 'prisma/seed-data/hospital-admins';
import { PATIENTS_EXAMPLES } from 'prisma/seed-data/patients';
import { User } from 'src/decorator/user.decorator';
import { OperatorLocalAuthGuard } from 'src/guard/operator/local-auth.guard';
import { PatientLocalAuthGuard } from 'src/guard/patient/local-auth.guard';
import { Roles } from 'src/guard/roles.guard';
import { SkipAuth } from 'src/guard/skip-auth.guard';
import { AuthService } from './auth.service';
import { CreateOperatorDto } from './dto/create-operator.dto';
import { OperatorAuthDto } from './dto/operator-auth.dto';
import { PatientAuthDto } from './dto/patient-auth.dto';

@ApiTags('authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('patient/check/:phoneNumber')
  @SkipAuth()
  async precheckPhoneNumber(@Param() phoneNumber: string) {
    return await this.authService.precheckPhoneNumber(phoneNumber);
  }

  @Roles(UserRole.ADMIN, UserRole.HOSPITAL_ADMIN)
  @Post('operator/register')
  async registerOperator(@Body() createOperatorDto: CreateOperatorDto) {
    const { role, firstName, lastName, hospitalId } = createOperatorDto;
    if (role === UserRole.DOCTOR) {
      return await this.authService.registerDoctor(
        firstName,
        lastName,
        hospitalId,
      );
    }

    if (role === UserRole.HOSPITAL_ADMIN) {
      return await this.authService.registerHospitalAdmin(
        firstName,
        lastName,
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
  @SkipAuth()
  @UseGuards(OperatorLocalAuthGuard)
  async loginOperator(@User() operator: any) {
    return await this.authService.loginOperator(operator);
  }

  @Post('patient/register')
  @SkipAuth()
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
  @SkipAuth()
  @UseGuards(PatientLocalAuthGuard)
  async loginPatient(@User() patient: any) {
    return await this.authService.loginPatient(patient);
  }
}
