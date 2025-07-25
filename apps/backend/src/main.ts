import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Logger } from 'nestjs-pino';
import { CustomErrorResponse } from '@lib/customResponse/customErrorResponse';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true,
  });

  //pino logger
  app.useLogger(app.get(Logger));
  //custom error response
  app.useGlobalFilters(new CustomErrorResponse());

  //cors
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
      transform: true,
    }),
  );
  
  await app.listen(process.env.PORT ?? 4000);
}

bootstrap();
