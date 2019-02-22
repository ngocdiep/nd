import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as bodyParser from 'body-parser';
const { graphqlUploadExpress } = require('graphql-upload');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useStaticAssets(join(__dirname, '../storage'), {prefix: '/storage/'});
  app.enableCors();
  app.use(graphqlUploadExpress());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  await app.listen(5000);
}
bootstrap();
