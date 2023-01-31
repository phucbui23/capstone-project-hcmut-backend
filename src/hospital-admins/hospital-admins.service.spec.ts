import { Test, TestingModule } from '@nestjs/testing';

import { HospitalAdminsService } from './hospital-admins.service';

describe('HospitalAdminsService', () => {
  let service: HospitalAdminsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HospitalAdminsService],
    }).compile();

    service = module.get<HospitalAdminsService>(HospitalAdminsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
