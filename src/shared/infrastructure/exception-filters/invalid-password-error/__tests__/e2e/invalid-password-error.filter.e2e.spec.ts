import { InvalidPasswordError } from "@/shared/application/errors/invalid-password-error";
import { Controller, Get, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { InvalidPasswordErrorFilter } from "../../invalid-password-error.filter";
import request from 'supertest';

@Controller('stub')
class StubController{
  @Get()
  index(){
    throw new InvalidPasswordError('old password does not match')
  }
}
describe('InvalidPasswordErrorFilter e2e', () => {
    let app: INestApplication
    let module: TestingModule

    beforeAll(async () => {
      module = await Test.createTestingModule({
        controllers: [StubController]
      }).compile()
      app = module.createNestApplication()

      app.useGlobalFilters(new InvalidPasswordErrorFilter())
      await app.init()
    });

    it('should be defined', () => {
      expect(new InvalidPasswordErrorFilter()).toBeDefined();
    });

    it('should catch one InvalidPasswordError', () => {
      return request(app.getHttpServer()).get('/stub').expect(422)
      .expect({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'old password does not match'
      })
    })
  });
