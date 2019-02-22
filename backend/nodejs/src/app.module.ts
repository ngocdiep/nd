import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostgraphileModule } from './postgraphile/postgraphile.module';

@Module({
  imports: [PostgraphileModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
