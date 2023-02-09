import { Test, TestingModule } from '@nestjs/testing';
import { PatientSavesArticlesService } from './patient-saves-articles.service';

describe('PatientSavesArticlesService', () => {
  let service: PatientSavesArticlesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientSavesArticlesService],
    }).compile();

    service = module.get<PatientSavesArticlesService>(PatientSavesArticlesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
