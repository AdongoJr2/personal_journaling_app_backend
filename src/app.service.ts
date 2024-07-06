import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getAppV1Message() {
    return `Welcome to 'Personal Journaling App' Backend APIs`;
  }
}
