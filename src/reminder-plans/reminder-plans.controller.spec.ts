import { Test, TestingModule } from '@nestjs/testing';

import { ReminderPlansController } from './reminder-plans.controller';
import { ReminderPlansService } from './reminder-plans.service';

describe('ReminderPlansController', () => {
  let controller: ReminderPlansController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReminderPlansController],
      providers: [ReminderPlansService],
    }).compile();

    controller = module.get<ReminderPlansController>(ReminderPlansController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
