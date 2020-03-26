import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgraphileModule } from './postgraphile/postgraphile.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    PostgraphileModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['./environments/docker.env']
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
