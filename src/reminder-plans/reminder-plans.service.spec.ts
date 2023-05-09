import { Test, TestingModule } from '@nestjs/testing';

import { ReminderPlansService } from './reminder-plans.service';

describe('ReminderPlansService', () => {
  let service: ReminderPlansService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderPlansService],
    }).compile();

    service = module.get<ReminderPlansService>(ReminderPlansService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
