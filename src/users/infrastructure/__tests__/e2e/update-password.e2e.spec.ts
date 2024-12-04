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
import { UpdatePasswordDto } from "../../dto/update-password.dto";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptjsHashProvider } from "../../providers/hash-provider/bcryptjs-hash.provider";

describe('UsersController e2e tests', () => {
  let app: INestApplication
  let module: TestingModule
  let repository: UserRepository.Repository
  let updatePasswordDTO: UpdatePasswordDto
  const prismaService = new PrismaClient
  let hashProvider: HashProvider
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
    hashProvider = new BcryptjsHashProvider()
  });

  beforeEach(async () => {
    updatePasswordDTO = {
      password: 'new_password',
      oldPassword: 'old_password'
    }

    await prismaService.user.deleteMany()
    const hashPassword = await hashProvider.generateHash('old_password')
    entity = new UserEntity(UserDataBuilder({password: hashPassword}))
    await repository.insert(entity)
  });

  describe('POST /users', () => {
    it('should update a password',async () => {
      const res = await request(app.getHttpServer())
      .patch(`/users/${entity._id}`)
      .send(updatePasswordDTO).expect(200)
      expect(Object.keys(res.body)).toStrictEqual(['data'])

      const user = await repository.findById(res.body.data.id)
      const checkNewPassword = await hashProvider.comparehash('new_password',user.password)
      expect(checkNewPassword).toBeTruthy()
    });

    it('should return an error with 422 code when the request body is invalid',async () => {
      const res = await request(app.getHttpServer())
      .patch('/users/fakeId')
      .send({}).expect(422)
      expect(res.body.error).toBe('Unprocessable Entity') //para tipos primitivos
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
        'oldPassword should not be empty',
        'oldPassword must be a string',
      ]) //para arrays e objetos
    });

    it('should return an error with 404 code when throw NotFoundError with invalid id',async () => {
      const res = await request(app.getHttpServer())
      .patch('/users/fakeId')
      .send(updatePasswordDTO).expect(404)
      expect(res.body.error).toBe('Not found')
      expect(res.body.message).toEqual('userModel not found using id fakeId')
    });

    it('should return an error with 422 code when the password field is invalid',async () => {
      delete updatePasswordDTO.password
      const res = await request(app.getHttpServer())
      .patch(`/users/${entity._id}`)
      .send(updatePasswordDTO).expect(422)
      expect(res.body.error).toBe('Unprocessable Entity') //para tipos primitivos
      expect(res.body.message).toEqual([
        'password should not be empty',
        'password must be a string',
      ]) //para arrays e objetos
    });

    it('should return an error with 422 code when the old password field is invalid',async () => {
      delete updatePasswordDTO.oldPassword
      const res = await request(app.getHttpServer())
      .patch(`/users/${entity._id}`)
      .send(updatePasswordDTO).expect(422)
      expect(res.body.error).toBe('Unprocessable Entity') //para tipos primitivos
      expect(res.body.message).toEqual([
        'oldPassword should not be empty',
        'oldPassword must be a string',
      ]) //para arrays e objetos
    });

    it('should return an error with 422 code when password does not match',async () => {
      updatePasswordDTO.oldPassword = 'fake'
      const res = await request(app.getHttpServer())
      .patch(`/users/${entity._id}`)
      .send(updatePasswordDTO).expect(422)
      .expect({
        statusCode: 422,
        error: 'Unprocessable Entity',
        message: 'old password does not match'
      })
    });
  });
})
