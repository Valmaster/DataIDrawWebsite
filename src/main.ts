import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('DataIDraw API');
  const config = new DocumentBuilder()
    .setTitle('DataIDraw API')
    .setVersion('0.0.1')
    .setDescription(
      'DataIDraw Website',
    )
    .addTag('dataidraw-api')
    .addBearerAuth()
    .build();

  app.use(cookieParser());
  app.enableCors({
    origin: ['*'],
    credentials: true
  });

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  await app.listen(3000);
  logger.log(`Server started @http://locahost:3000`);
}

bootstrap();