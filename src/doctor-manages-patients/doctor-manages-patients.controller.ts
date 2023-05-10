import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from 'src/guard/roles.guard';
import { DoctorManagesPatientsService } from './doctor-manages-patients.service';
import { CreateDoctorManagesPatientDto } from './dto/create-doctor-manages-patient.dto';

@ApiTags('doctor-manages-patients')
@Controller('doctor-manages-patients')
export class DoctorManagesPatientsController {
  constructor(
    private readonly doctorManagesPatientsService: DoctorManagesPatientsService,
  ) {}

  @Post()
  @Roles(UserRole.ADMIN, UserRole.DOCTOR, UserRole.HOSPITAL_ADMIN)
  async create(
    @Body() createDoctorManagesPatientDto: CreateDoctorManagesPatientDto,
  ) {
    return await this.doctorManagesPatientsService.create(
      createDoctorManagesPatientDto,
    );
  }

  // @Get()
  // findAll() {
  //   return this.doctorManagesPatientsService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.doctorManagesPatientsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(
  //   @Param('id') id: string,
  //   @Body() updateDoctorManagesPatientDto: UpdateDoctorManagesPatientDto,
  // ) {
  //   return this.doctorManagesPatientsService.update(
  //     +id,
  //     updateDoctorManagesPatientDto,
  //   );
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.doctorManagesPatientsService.remove(+id);
  // }
}
