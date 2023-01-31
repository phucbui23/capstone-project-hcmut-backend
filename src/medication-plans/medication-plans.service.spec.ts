import { Test, TestingModule } from '@nestjs/testing';

import { MedicationPlansService } from './medication-plans.service';

describe('MedicationPlansService', () => {
  let service: MedicationPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MedicationPlansService],
    }).compile();

    service = module.get<MedicationPlansService>(MedicationPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
