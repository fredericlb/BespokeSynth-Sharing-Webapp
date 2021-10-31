import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
const express = require('express');

console.log(express);

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  console.log(process.env.STORAGE_DIR);
  app.use('/files', express.static(process.env.STORAGE_DIR, {}));
  //  app.use('/files', express.static(process.env.STORAGE_DIR));
  await app.listen(8000);
}
bootstrap();
