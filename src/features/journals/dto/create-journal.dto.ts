import {
  IsDateString,
  IsDefined,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';

export class CreateJournalDto {
  /**
   * Journal Title
   *
   * @example Sample journal title
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
  title: string;

  /**
   * Journal Content/Description
   *
   * @example Sample journal description
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
  content: string;

  /**
   * Journal Entry Date
   *
   * @example 2024-07-06T23:00.000Z
   */
  @IsDefined({
    message: '$property is required',
  })
  @IsNotEmpty({
    message: '$property cannot be empty',
  })
  @IsDateString()
  entryDate: string;

  /**
   * Journal Category ID
   *
   * @example 1
   */
  @IsDefined({
    message: '$property is required',
  })
  @IsNumber(undefined, {
    message: '$property must be a number',
  })
  categoryId: number;
}
