import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import pkg from '@vendia/serverless-express';
const { configure } = pkg as any;
import { Callback, Context, Handler } from 'aws-lambda';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Tus configuraciones habituales
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  
  // 👈 Usamos 'configure' (o la importación envuelta en any)
  // @ts-ignore
  return (pkg.default || pkg)({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  if (!server) {
    server = await bootstrap();
  }
  return server(event, context, callback);
};