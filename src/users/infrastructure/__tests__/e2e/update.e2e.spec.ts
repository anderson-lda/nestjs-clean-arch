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

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let updateUserDTO: UpdateUserDto
  const prismaService = new PrismaClient
  let entity: UserEntity

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
  });

  beforeEach(async () => {
    updateUserDTO = {
      name: 'test name',
    }

    await prismaService.user.deleteMany()
    entity = new UserEntity(UserDataBuilder({}))
    await repository.insert(entity)
  });

  describe('PUT /users/:id', () => {
    it('should update a user',async () => {
      updateUserDTO.name = 'test name'
      const res = await request(app.getHttpServer())
      .put(`/users/${entity._id}`)
      .send(updateUserDTO).expect(200)
      const user = await repository.findById(entity._id)
      const presenter = UsersController.userToResponse(user.toJSON())
      const serialized = instanceToPlain(presenter)
      expect(res.body.data).toStrictEqual(serialized)
    });

    it('should return an error with 422 code when the request body is invalid',async () => {
      const res = await request(app.getHttpServer())
      .put(`/users/${entity._id}`)
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
      .send(updateUserDTO).expect(404)
      .expect({
        statusCode: 404,
        error: 'Not found',
        message: 'userModel not found using id fakeId'
      })
    });

  });
})
