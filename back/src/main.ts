import * as dns from 'dns';
dns.setServers(['8.8.8.8', '1.1.1.1']);

import { NestFactory } from '@nestjs/core';
 import { AppModule } from './app.module.js';
import { ValidationPipe } from '@nestjs/common';
// import { NestExpressApplication } from '@nestjs/platform-express';
// import { dirname, join } from 'path';
// import { fileURLToPath } from 'url';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {cors: true});
  // const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // app.enableCors({
  //   origin: '*', // Permite peticiones desde cualquier origen (ideal para desarrollo y tu front en Vercel)
  //   methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  //   credentials: true,
  // });
  app.enableCors();
  // Activamos validaciones globales
  // app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }));
  app.useGlobalPipes(new ValidationPipe());
  // Exponer la carpeta 'uploads' de manera estática
  // app.useStaticAssets(join(__dirname, '..', 'uploads'));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();