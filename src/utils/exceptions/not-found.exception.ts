import { HttpException, HttpStatus } from '@nestjs/common';

export class CustomNotFoundException extends HttpException {
  constructor(message: string) {
    super(
      {
        status: 'error',
        message: message || 'Not Found',
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
