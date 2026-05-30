import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://aegis-frontend-gilt.vercel.app',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap(); // ← 'void' prefix fixes the no-floating-promises warning
