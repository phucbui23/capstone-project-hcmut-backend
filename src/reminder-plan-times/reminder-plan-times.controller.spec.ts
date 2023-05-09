import { Test, TestingModule } from '@nestjs/testing';

import { ReminderPlanTimesController } from './reminder-plan-times.controller';
import { ReminderPlanTimesService } from './reminder-plan-times.service';

describe('ReminderPlanTimesController', () => {
  let controller: ReminderPlanTimesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderPlanTimesController],
      providers: [ReminderPlanTimesService],
    }).compile();

    controller = module.get<ReminderPlanTimesController>(
      ReminderPlanTimesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
