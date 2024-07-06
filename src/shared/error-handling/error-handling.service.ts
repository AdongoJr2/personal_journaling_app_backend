import { Injectable } from '@nestjs/common';
import { CustomBadRequestException } from 'src/utils/exceptions/bad-request.exception';
import { DatabaseErrorException } from 'src/utils/exceptions/database-error.exception';
import { CustomForbiddenException } from 'src/utils/exceptions/forbidden.exception';
import { CustomInternalServerErrorException } from 'src/utils/exceptions/internal-server-error.exception';
import { CustomNotFoundException } from 'src/utils/exceptions/not-found.exception';
import { CustomUnauthorizedException } from 'src/utils/exceptions/unauthorized.exception';
import { formatDatabaseError } from 'src/utils/transformations/database-errors';

@Injectable()
export class ErrorHandlingService {
  getException(error: any) {
    // TODO: handle errors thrown by search, sort, and filter

    // errors from the database
    if (error?.driverError) {
      const { message } = formatDatabaseError(error.driverError);
      return new DatabaseErrorException(message);
    }

    // http errors
    if (error?.name === 'CustomUnauthorizedException') {
      return new CustomUnauthorizedException(error?.message);
    }

    if (error?.name === 'CustomForbiddenException') {
      return new CustomForbiddenException();
    }

    if (error?.name === 'CustomNotFoundException') {
      return new CustomNotFoundException(error?.message);
    }

    if (error?.name === 'CustomBadRequestException') {
      return new CustomBadRequestException(error?.message);
    }

    // other errors
    return new CustomInternalServerErrorException(error);
  }
}
