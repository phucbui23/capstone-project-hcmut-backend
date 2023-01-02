import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor() {}

  async checkAppRunning(): Promise<string> {
    return 'Server is running';
  }
}
