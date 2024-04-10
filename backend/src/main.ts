import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";

import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";
import fastifyCookie from "@fastify/cookie";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.register(fastifyCookie);
  app.enableCors({
    credentials: true,
    origin: "http://localhost:3001",
  });
  await app.listen(3000);
}
bootstrap();
