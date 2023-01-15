import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';
import { AppService } from './app.service';

class SampleDate {
  @Type(() => Date)
  @IsNotEmpty()
  @IsDate()
  date: Date;
}

@ApiTags('app')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async checkAppRunning(): Promise<string> {
    return await this.appService.checkAppRunning();
  }

  @Get('get-date')
  getDate() {
    return new Date(Date.now());
  }

  @Post('post-date')
  postDate(@Body() data: SampleDate) {
    console.log(data);
    return data;
  }
}
