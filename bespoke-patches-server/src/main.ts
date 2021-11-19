import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ExpressAdapter, NestExpressApplication } from '@nestjs/platform-express';
import * as compression from 'compression';


const express = require('express');


async function bootstrap() {
  const server = express();
  server.use(compression());

  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.use('/files', express.static(process.env.STORAGE_DIR, {}));

  app.use('/robots.txt', function (req, res, next) {
    res.type('text/plain')
    res.send("User-agent: *\nAllow: /\nDisallow: /upload");
});

  //  app.use('/files', express.static(process.env.STORAGE_DIR));
  await app.listen(8000);
}
bootstrap();
