import { Test, TestingModule } from '@nestjs/testing';
import { JournalCategoriesController } from './journal-categories.controller';
import { JournalCategoriesService } from './journal-categories.service';

describe('JournalCategoriesController', () => {
  let controller: JournalCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [JournalCategoriesController],
      providers: [JournalCategoriesService],
    }).compile();

    controller = module.get<JournalCategoriesController>(
      JournalCategoriesController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
