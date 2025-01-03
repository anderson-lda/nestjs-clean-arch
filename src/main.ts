import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ClassSerializerInterceptor } from '@nestjs/common';
import { applyGLobalConfig } from './global-config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule,new FastifyAdapter());
  const config = new DocumentBuilder().setTitle('NodeJS Course')
  .setDescription('NodeJS Rest API - NestJS, DDD, Clean Architecture and Automated Tests')
  .setVersion('1.0.0').addBearerAuth({
    description: 'Informar o JWT para autorizar o acesso',
    name: 'Authorization',
    scheme: 'Bearer',
    type: 'http',
    in: 'Header',
  }).build()

  const document = SwaggerModule.createDocument(app,config)
  SwaggerModule.setup('api', app, document)
  applyGLobalConfig(app)
  //app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)))
  await app.listen(3000,'0.0.0.0');
}
bootstrap();
