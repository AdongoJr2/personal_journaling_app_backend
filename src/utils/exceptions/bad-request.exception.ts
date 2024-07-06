import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomBadRequestException extends HttpException {
  constructor(message?: string) {
    super(
      {
        status: 'error',
        message: message || 'Bad Request',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}
