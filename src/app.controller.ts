import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseService } from './core/modules/api-response/api-response/api-response.service';
import { ErrorHandlingService } from './shared/error-handling/error-handling.service';
import { APIResponseBodyStatus } from './core/types/api-response-body-status';

@ApiTags('Home')
@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly apiResponseService: ApiResponseService,
    private readonly errorHandlingService: ErrorHandlingService,
  ) {}

  @Get()
  getAppV1Message() {
    try {
      const responseBody = this.apiResponseService.getResponseBody({
        status: APIResponseBodyStatus.SUCCESS,
        message: this.appService.getAppV1Message(),
        data: null,
      });

      return responseBody;
    } catch (error) {
      throw this.errorHandlingService.getException(error);
    }
  }
}
