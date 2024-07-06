import { IsDefined, IsOptional } from 'class-validator';
import { APIResponseBodyStatus } from './api-response-body-status';
import { ApiProperty } from '@nestjs/swagger';

export class APIResponseBodyDTO {
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

  @IsOptional()
  @ApiProperty({
    example: null,
  })
  data?: any;
}
