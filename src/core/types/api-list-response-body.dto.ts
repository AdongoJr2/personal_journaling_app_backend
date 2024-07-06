import { IsDefined, IsOptional } from 'class-validator';
import { APIResponseBodyStatus } from './api-response-body-status';
import { ApiProperty } from '@nestjs/swagger';

export class APIListResponseBodyDataDTO<T> {
  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: 1,
  })
  count: number;

  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: 5,
  })
  pages: number;

  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: [{ id: 1, name: 'Sample' }],
  })
  list: T[];
}

export class APIListResponseBodyDTO<T> {
  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    enum: APIResponseBodyStatus,
    enumName: 'APIResponseBodyStatus',
  })
  status: APIResponseBodyStatus;

  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: 'Operation completed successfully',
  })
  message: string;

  @IsDefined({
    message: '$property is required',
  })
  data: APIListResponseBodyDataDTO<T>;
}

export class APIListResponseBodyOptionsDTO<T> {
  @IsOptional()
  @ApiProperty({
    example: null,
  })
  message?: string;

  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: 1,
  })
  count: number;

  @IsDefined({
    message: '$property is required',
  })
  @ApiProperty({
    example: 5,
  })
  pageSize: number;

  @IsDefined({
    message: '$property is required',
  })
  records: T[];
}
