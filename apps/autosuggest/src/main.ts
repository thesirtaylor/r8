import { NestFactory } from '@nestjs/core';
import { AutosuggestModule } from './autosuggest.module';

async function bootstrap() {
  const app = await NestFactory.create(AutosuggestModule);
  await app.listen(process.env.port ?? 3001);
}
bootstrap();
