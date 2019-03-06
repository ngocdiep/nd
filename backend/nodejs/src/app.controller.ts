import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { join } from 'path';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('/nd')
  getNd(): string {
    return 'nd';
  }
  @Get('*')
  root(@Res() response): void {
    // the homepage will load our index.html which contains angular logic
    response.sendFile(join(__dirname, '../web-app/index.html'));
  }

}
