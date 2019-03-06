import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const { graphqlUploadExpress } = require('graphql-upload');
  const app = await NestFactory.create(AppModule);
  app.useStaticAssets(join(__dirname, '../storage'), {prefix: '/storage/'});
  app.useStaticAssets(join(__dirname, '../web-app'));
  app.enableCors();
  app.use(graphqlUploadExpress());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  await app.listen(5000);
}
bootstrap();
