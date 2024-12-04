import { Reflector } from '@nestjs/core';
import { ClassSerializerInterceptor, INestApplication, ValidationPipe } from '@nestjs/common';
import { WrapperDataInterceptor } from './shared/infrastructure/interceptors/wrapper-data/wrapper-data.interceptor';
import { ConflictErrorFilter } from './shared/infrastructure/exception-filters/conflict-error/conflict-error.filter';
import { NotFoundErrorFilter } from './shared/infrastructure/exception-filters/not-found-error/not-found-error.filter';
import { InvalidPasswordErrorFilter } from './shared/infrastructure/exception-filters/invalid-password-error/invalid-password-error.filter';

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

  app.useGlobalFilters(
    new ConflictErrorFilter(),
    new NotFoundErrorFilter(),
    new InvalidPasswordErrorFilter())
}
