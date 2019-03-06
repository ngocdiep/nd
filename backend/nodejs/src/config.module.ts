import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import * as path from 'path';

@Module({
  providers: [
    {
      provide: ConfigService,
      // useValue: new ConfigService(`./environments/${process.env.NODE_ENV}.env`),
      useValue: new ConfigService(`./environments/production.env`),
      // useValue: new ConfigService(path.join(process.cwd(), `./environments/development.env`)),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
