import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as dotenv from 'dotenv';
import * as cors from 'cors';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);

  // app.enableCors({
  //   allowedHeaders: ['content-type'],
  //   origin: 'http://localhost:5173',
  //   credentials: true,
  // });
  app.use(
    cors({
      origin: [
        'http://localhost:5173',
        'https://lost-and-found-delta.vercel.app',
      ],
      methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
      allowedHeaders: '*',
      credentials: true,
    }),
  );
  await app.listen(3000);
}
bootstrap();
