import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateDoctorManagesPatientDto } from './dto/create-doctor-manages-patient.dto';
import { UpdateDoctorManagesPatientDto } from './dto/update-doctor-manages-patient.dto';

@Injectable()
export class DoctorManagesPatientsService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(createDoctorManagesPatientDto: CreateDoctorManagesPatientDto) {
    const { doctorId, patientId } = createDoctorManagesPatientDto;
    const management = await this.prismaService.doctorManagesPatient.findUnique(
      {
        where: {
          doctorAccountId_patientAccountId: {
            doctorAccountId: doctorId,
            patientAccountId: patientId,
          },
        },
      },
    );

    if (!management) {
      await this.prismaService.doctorManagesPatient.create({
        data: {
          doctorAccountId: doctorId,
          patientAccountId: patientId,
        },
      });
    }
    return;
  }

  findAll() {
    return `This action returns all doctorManagesPatients`;
  }

  findOne(id: number) {
    return `This action returns a #${id} doctorManagesPatient`;
  }

  update(
    id: number,
    updateDoctorManagesPatientDto: UpdateDoctorManagesPatientDto,
  ) {
    return `This action updates a #${id} doctorManagesPatient`;
  }

  remove(id: number) {
    return `This action removes a #${id} doctorManagesPatient`;
  }
}
