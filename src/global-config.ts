import { Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { WrapperDataInterceptor } from './shared/infrastructure/interceptors/wrapper-data/wrapper-data.interceptor';

export function applyGLobalConfig(app: INestApplication) {
  app.useGlobalPipes(
    new ValidationPipe({
      errorHttpStatusCode: 422,
      whitelist: true, //o que for enviado além do esperado é descartado
      forbidNonWhitelisted: true, //recusar a requisição caso alguma informação indevida seja enviada
      transform: true, //transforma os dados de uma requisição para a definição do DTO
    })
  )

  app.useGlobalInterceptors(new WrapperDataInterceptor(),
    new ClassSerializerInterceptor(app.get(Reflector)))
}
