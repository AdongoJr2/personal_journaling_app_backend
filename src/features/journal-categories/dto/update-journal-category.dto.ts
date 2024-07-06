import { PartialType } from '@nestjs/swagger';
import { CreateJournalCategoryDto } from './create-journal-category.dto';

export class UpdateJournalCategoryDto extends PartialType(
  CreateJournalCategoryDto,
) {}
