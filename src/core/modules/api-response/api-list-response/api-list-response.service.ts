import { Injectable } from '@nestjs/common';
import {
  APIListResponseBody,
  APIListResponseBodyOptions,
} from 'src/core/types/api-list-response-body';
import { APIResponseBodyStatus } from 'src/core/types/api-response-body-status';
import { generateListResponseBodyData } from 'src/utils/response/response-body';

@Injectable()
export class ApiListResponseService {
  public getResponseBody<T>({
    message,
    count,
    pageSize,
    records,
  }: APIListResponseBodyOptions<T>) {
    const resBody: APIListResponseBody<T> = {
      status: APIResponseBodyStatus.SUCCESS,
      message: message || 'records retrieved successfully',
      data: generateListResponseBodyData(count, pageSize, records),
    };

    return resBody;
  }
}
