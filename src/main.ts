import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://aegis-frontend-gilt.vercel.app',
      'https://aegis-frontend-pvkkj0erl-devmamta569-4397s-projects.vercel.app',
      /\.vercel\.app$/,
    ],
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();