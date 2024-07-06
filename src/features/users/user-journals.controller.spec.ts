import { Test, TestingModule } from '@nestjs/testing';
import { UserJournalsController } from './user-journals.controller';

describe('UserJournalsController', () => {
  let controller: UserJournalsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserJournalsController],
    }).compile();

    controller = module.get<UserJournalsController>(UserJournalsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
