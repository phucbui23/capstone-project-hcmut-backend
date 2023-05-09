import { Test, TestingModule } from '@nestjs/testing';

import { MedicationPlansController } from './medication-plans.controller';
import { MedicationPlansService } from './medication-plans.service';

describe('MedicationPlansController', () => {
  let controller: MedicationPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationPlansController],
      providers: [MedicationPlansService],
    }).compile();

    controller = module.get<MedicationPlansController>(
      MedicationPlansController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
