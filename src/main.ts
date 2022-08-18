// import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const cookieSession = require('cookie-session');
// cookieSession has a problem with ES modules so common JS import statement is used.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.use(
  //   cookieSession({
  //     keys: ['asdfkjsk'],
  //   }),
  // );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true, // strips off extra properties in JSON request body
  //   }),
  // );
  await app.listen(3000);
}
bootstrap();
