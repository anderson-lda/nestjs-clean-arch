import { UserRepository } from "@/users/domain/repositories/user.repository";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests";
import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module";
import { UsersModule } from "../../users.module";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import request from 'supertest'
import { applyGLobalConfig } from "@/global-config";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/testing/helper/user-data-builder";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { SigninDto } from "../../dto/signin.dto";
import { BcryptjsHashProvider } from "../../providers/hash-provider/bcryptjs-hash.provider";

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let signinDTO: SigninDto
  let hashProvider: HashProvider
  const prismaService = new PrismaClient

  beforeAll(async () => {
    setupPrismaTests()
    module = await Test.createTestingModule({
      imports: [
        EnvConfigModule,
        UsersModule,
        DatabaseModule.forTest(prismaService)
      ]
    }).compile()
    app = module.createNestApplication()
    applyGLobalConfig(app)
    await app.init()
    repository = module.get<UserRepository.Repository>('UserRepository')
    hashProvider = new BcryptjsHashProvider()
  });

  beforeEach(async () => {
    signinDTO = {
      email: 'a@a.com',
      password: 'TestPassword123'
    }

    await prismaService.user.deleteMany()
  });

  describe('POST /users/login', () => {
    it('should authenticate a user',async () => {
      const passwordHash = await hashProvider.generateHash(signinDTO.password)
      const entity = new UserEntity({
        ...UserDataBuilder({}),
        email: signinDTO.email,
        password: passwordHash,
      })
      await repository.insert(entity)
      const res = await request(app.getHttpServer())
      .post('/users/login')
      .send(signinDTO).expect(200)
      expect(Object.keys(res.body)).toStrictEqual(['accessToken'])
      expect(typeof   res.body.accessToken).toEqual('string')
    });

    it('should return an error with 422 code when the request body is invalid',async () => {
      const res = await request(app.getHttpServer())
      .post('/users/login')
      .send({}).expect(422)
      expect(res.body.error).toBe('Unprocessable Entity') //para tipos primitivos
      expect(res.body.message).toEqual([
        'email should not be empty',
        'email must be a string',
        'email must be an email',
        'password should not be empty',
        'password must be a string'
      ]) //para arrays e objetos
    });


    it('should return an error with 422 code when the email field is invalid',async () => {
      delete signinDTO.email
      const res = await request(app.getHttpServer())
      .post('/users/login')
      .send(signinDTO).expect(422)
      expect(res.body.error).toBe('Unprocessable Entity') //para tipos primitivos
      expect(res.body.message).toEqual([
        'email should not be empty',
        'email must be a string',
        'email must be an email',
      ]) //para arrays e objetos
    });

    it('should return an error with 422 code when the password field is invalid',async () => {
      delete signinDTO.password
      const res = await request(app.getHttpServer())
      .post('/users/login')
      .send(signinDTO).expect(422)
      expect(res.body.error).toBe('Unprocessable Entity') //para tipos primitivos
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string'
      ]) //para arrays e objetos
    });

    it('should return an error with 404 code when email is not found',async () => {
      const res = await request(app.getHttpServer())
      .post('/users/login')
      .send({email: 'b@b.com', password: 'fake'}).expect(404)
      expect(res.body.error).toBe('Not found')
      expect(res.body.message).toEqual('userModel not found using email b@b.com')
    });

    it('should return an error with 400 code when password is incorrect',async () => {
      const passwordHash = await hashProvider.generateHash(signinDTO.password)
      const entity = new UserEntity({
        ...UserDataBuilder({}),
        email: signinDTO.email,
        password: passwordHash,
      })
      await repository.insert(entity)
      const res = await request(app.getHttpServer())
      .post('/users/login')
      .send({email: signinDTO.email, password: 'fake'}).expect(400)
      .expect({
        statusCode: 400,
        error: 'Bad Request',
        message: 'Invalid credentials'
      })
    });
  });
})
