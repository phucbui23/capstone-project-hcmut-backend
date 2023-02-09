import { Test, TestingModule } from '@nestjs/testing';
import { PatientSavesArticlesController } from './patient-saves-articles.controller';
import { PatientSavesArticlesService } from './patient-saves-articles.service';

describe('PatientSavesArticlesController', () => {
  let controller: PatientSavesArticlesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientSavesArticlesController],
      providers: [PatientSavesArticlesService],
    }).compile();

    controller = module.get<PatientSavesArticlesController>(PatientSavesArticlesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
