import {
  Controller,
  UseInterceptors,
  ClassSerializerInterceptor,
  UseGuards,
  Logger,
} from '@nestjs/common';
import { JournalsService } from './journals.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ErrorHandlingService } from 'src/shared/error-handling/error-handling.service';
import { ConfigService } from '@nestjs/config';
import { ApiListResponseService } from 'src/core/modules/api-response/api-list-response/api-list-response.service';
import { ApiResponseService } from 'src/core/modules/api-response/api-response/api-response.service';
import { AuthService } from '../auth/auth.service';

@ApiTags('Journals')
@ApiBearerAuth()
@UseInterceptors(ClassSerializerInterceptor)
@UseGuards(JwtAuthGuard)
@Controller('journals')
export class JournalsController {
  constructor(
    private readonly journalsService: JournalsService,
    private readonly authService: AuthService,
    private readonly apiResponseService: ApiResponseService,
    private readonly apiListResponseService: ApiListResponseService,
    private readonly configService: ConfigService,
    private readonly errorHandlingService: ErrorHandlingService,
    private readonly logger: Logger,
  ) {}
}
