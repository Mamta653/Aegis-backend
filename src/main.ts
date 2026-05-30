import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'https://your-vercel-url.vercel.app',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap(); // ← 'void' prefix fixes the no-floating-promises warning
