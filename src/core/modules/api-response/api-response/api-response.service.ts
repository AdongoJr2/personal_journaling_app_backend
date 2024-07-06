import { Injectable } from '@nestjs/common';
import { APIResponseBodyDTO } from 'src/core/types/api-response-body.dto';

@Injectable()
export class ApiResponseService {
  public getResponseBody({
    status,
    message,
    data,
  }: APIResponseBodyDTO): APIResponseBodyDTO {
    const resBody = {
      status,
      message,
      data,
    };

    return resBody;
  }
}
