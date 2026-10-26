import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { ExpressAdapter } from '@nestjs/platform-express';
import express from 'express';
import { configure as serverlessExpress } from '@vendia/serverless-express';

let cachedServer: any;

async function bootstrap() {
  if (!cachedServer) {
    const expressApp = express();
    const app = await NestFactory.create(
      AppModule,
      new ExpressAdapter(expressApp),
    );

    app.enableCors();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

    await app.init();
    cachedServer = serverlessExpress({ app: expressApp });
  }
  return cachedServer;
}

export const handler = async (req: any, res: any, context: any) => {
  const server = await bootstrap();
  return server(req, res, context);
};