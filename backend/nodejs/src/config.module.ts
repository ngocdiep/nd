import { Module } from '@nestjs/common';
import { ConfigService } from './config.service';

@Module({
  providers: [
    {
      provide: ConfigService,
      // useValue: new ConfigService(`./src/environments/${process.env.NODE_ENV}.env`),
      // useValue: new ConfigService(`./src/environments/production.env`),
      useValue: new ConfigService(`./src/environments/development.env`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
