import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import { join } from 'path';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );
  const { graphqlUploadExpress } = require('graphql-upload');
  app.useStaticAssets(join(__dirname, '../storage'), { prefix: '/storage/' });
  app.useStaticAssets(join(__dirname, '../frontend'));
  app.enableCors();
  app.enable('trust proxy');
  app.use(graphqlUploadExpress());
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ extended: true }));
  const PORT = process.env.PORT || 5000;
// tslint:disable-next-line: no-console
  console.log(`App listening on port ${PORT}`);
  await app.listen(PORT);
}
bootstrap();
