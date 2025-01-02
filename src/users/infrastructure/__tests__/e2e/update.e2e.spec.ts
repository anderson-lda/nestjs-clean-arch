import { UserRepository } from "@/users/domain/repositories/user.repository";
import { INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { PrismaClient } from "@prisma/client";
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests";
import { EnvConfigModule } from "@/shared/infrastructure/env-config/env-config.module";
import { UsersModule } from "../../users.module";
import { DatabaseModule } from "@/shared/infrastructure/database/database.module";
import request from 'supertest'
import { UsersController } from "../../users.controller";
import { instanceToPlain } from "class-transformer";
import { applyGLobalConfig } from "@/global-config";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UserDataBuilder } from "@/users/domain/testing/helper/user-data-builder";
import { UpdateUserDto } from "../../dto/update-user.dto";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptjsHashProvider } from "../../providers/hash-provider/bcryptjs-hash.provider";

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let updateUserDTO: UpdateUserDto
  const prismaService = new PrismaClient
  let entity: UserEntity
  let hashProvider: HashProvider
  let hashPassword: string
  let accessToken: string

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
    hashPassword = await hashProvider.generateHash('1234')
  });

  beforeEach(async () => {
    updateUserDTO = {
      name: 'test name',
    }

    await prismaService.user.deleteMany()
    entity = new UserEntity(UserDataBuilder({
      email: 'a@a.com',
      password: hashPassword,
    }))
    await repository.insert(entity)
    const loginResponse = await request(app.getHttpServer())
      .post('/users/login').send({email:'a@a.com', password: '1234'})
      .expect(200)
    accessToken = loginResponse.body.accessToken
  });

  describe('PUT /users/:id', () => {
    it('should update a user',async () => {
      updateUserDTO.name = 'test name'
      const res = await request(app.getHttpServer())
      .put(`/users/${entity._id}`)
      .set('Authorization',`Bearer ${accessToken}`)
      .send(updateUserDTO).expect(200)
      const user = await repository.findById(entity._id)
      const presenter = UsersController.userToResponse(user.toJSON())
      const serialized = instanceToPlain(presenter)
      expect(res.body.data).toStrictEqual(serialized)
    });

    it('should return an error with 422 code when the request body is invalid',async () => {
      const res = await request(app.getHttpServer())
      .put(`/users/${entity._id}`)
      .set('Authorization',`Bearer ${accessToken}`)
      .send({}).expect(422)
      expect(res.body.error).toBe('Unprocessable Entity') //para tipos primitivos
      expect(res.body.message).toEqual([
        'name should not be empty',
        'name must be a string',
      ]) //para arrays e objetos
    });

    it('should return an error with 404 code when throw NotFoundError with invalid id',async () => {
      const res = await request(app.getHttpServer())
      .put('/users/fakeId')
      .set('Authorization',`Bearer ${accessToken}`)
      .send(updateUserDTO).expect(404)
      .expect({
        statusCode: 404,
        error: 'Not found',
        message: 'userModel not found using id fakeId'
      })
    });

    it('should return an error with 401 code when the request is not authorized',async () => {
      const res = await request(app.getHttpServer())
      .put('/users/fakeId')
      .expect(401)
      .expect({
        statusCode: 401,
        message: 'Unauthorized'
      })
    });

  });
})
