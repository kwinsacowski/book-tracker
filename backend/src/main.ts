import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import 'dotenv/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port);

  console.log(`API running at http://localhost:${port}`);
}

void bootstrap();
