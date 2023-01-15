import { Test, TestingModule } from '@nestjs/testing';
import { ReminderPlanTimesService } from './reminder-plan-times.service';

describe('ReminderPlanTimesService', () => {
  let service: ReminderPlanTimesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReminderPlanTimesService],
    }).compile();

    service = module.get<ReminderPlanTimesService>(ReminderPlanTimesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
