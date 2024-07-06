import {
  ClassSerializerInterceptor,
  Controller,
  UseInterceptors,
} from '@nestjs/common';
import { RefreshTokensService } from './refresh-tokens.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Refresh Tokens')
@UseInterceptors(ClassSerializerInterceptor)
@Controller('refresh-tokens')
export class RefreshTokensController {
  constructor(private readonly refreshTokensService: RefreshTokensService) {}
}
