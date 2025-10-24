import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as express from 'express';
import * as path from 'path';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);


  app.use(
    '/uploads',
    express.static(path.join(__dirname, '..', 'uploads')),
  );

  app.enableCors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });

  configureSwagger(app);
  configureValidationPipe(app);
  await app.listen(process.env.PORT ?? 3333);
}

function configureSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('Aionz API')
    .setDescription('Swagger Aionz API - Full stack developer Jr')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
}


function configureValidationPipe(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
}
bootstrap();