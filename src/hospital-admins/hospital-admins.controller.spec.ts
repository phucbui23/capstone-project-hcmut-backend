import { Test, TestingModule } from '@nestjs/testing';
import { HospitalAdminsController } from './hospital-admins.controller';
import { HospitalAdminsService } from './hospital-admins.service';

describe('HospitalAdminsController', () => {
  let controller: HospitalAdminsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HospitalAdminsController],
      providers: [HospitalAdminsService],
    }).compile();

    controller = module.get<HospitalAdminsController>(HospitalAdminsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
