import { IsDefined, IsNotEmpty, IsString } from 'class-validator';

export class CreateJournalCategoryDto {
  /**
   * Journal Category Name
   *
   * @example Personal
   */
  @IsDefined({
    message: '$property is required',
  })
  @IsNotEmpty({
    message: '$property cannot be empty',
  })
  @IsString({
    message: '$property must be a string',
  })
  name: string;
}
