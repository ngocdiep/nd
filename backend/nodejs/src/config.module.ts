import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';
import * as path from 'path';

@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(path.join(process.cwd(), `./environments/production.env`)),
      // useValue: new ConfigService(path.join(process.cwd(), `./environments/development.env`)),
      // useValue: new ConfigService(path.join(process.cwd(), `./environments/docker.env`)),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
