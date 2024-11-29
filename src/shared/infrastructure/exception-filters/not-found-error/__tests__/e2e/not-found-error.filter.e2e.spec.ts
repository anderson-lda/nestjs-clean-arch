import { Controller, Get, INestApplication } from '@nestjs/common';
import { NotFoundErrorFilter } from '../../not-found-error.filter';
import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundError } from '@/shared/domain/errors/not-found-error';
import request from 'supertest';

@Controller('stub')
class StubController{
  @Get()
  index(){
    throw new NotFoundError('UserModel not found')
  }
}
describe('NotFoundErrorFilter e2e', () => {
  let app: INestApplication
  let module: TestingModule

  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [StubController]
    }).compile()
    app = module.createNestApplication()

    app.useGlobalFilters(new NotFoundErrorFilter())
    await app.init()
  });

  it('should be defined', () => {
    expect(new NotFoundErrorFilter()).toBeDefined();
  });

  it('should catch one NotFoundError', () => {
    return request(app.getHttpServer()).get('/stub').expect(404)
    .expect({
      statusCode: 404,
      error: 'Not found',
      message: 'UserModel not found'
    })
  })
});
