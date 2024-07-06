import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomForbiddenException extends HttpException {
  constructor(message?: string) {
    super(
      {
        status: 'error',
        message:
          message ?? 'You do not have sufficient permissions for this action',
      },
      HttpStatus.FORBIDDEN,
    );
  }
}
