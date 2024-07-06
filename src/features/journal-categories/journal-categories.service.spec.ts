import { Test, TestingModule } from '@nestjs/testing';
import { JournalCategoriesService } from './journal-categories.service';

describe('JournalCategoriesService', () => {
  let service: JournalCategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [JournalCategoriesService],
    }).compile();

    service = module.get<JournalCategoriesService>(JournalCategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
