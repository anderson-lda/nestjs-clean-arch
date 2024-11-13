import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { UserDataBuilder } from "@/users/domain/testing/helper/user-data-builder";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UpdatePasswordUseCase } from "../../update-password.usecase";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptjsHashProvider } from "@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import { InvalidPasswordError } from "@/shared/application/errors/invalid-password-error";

describe('UpdatePasswordUseCase unit tests', () => {
  let sut: UpdatePasswordUseCase.UseCase;
  let repository: UserInMemoryRepository //poderia ser userrepository.repository
  let hashProvider: HashProvider

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new UpdatePasswordUseCase.UseCase(repository,hashProvider)
  });

  it('should throw an error when the entity is not found', async () => {
    await expect(()=>sut.execute({id:'fake_id', password: 'test_password', oldPassword: 'old_password'}))
    .rejects.toThrow(new NotFoundError('entity not found'))
  });

  it('should throw an error when old password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({}))
    repository.items = [entity]
    await expect(()=>sut.execute({id:entity._id, password: 'test_password', oldPassword: ''}))
    .rejects.toThrow(new InvalidPasswordError('old password and new password are required'))
  });

  it('should throw an error when password not provided', async () => {
    const entity = new UserEntity(UserDataBuilder({password: '1234'}))
    repository.items = [entity]
    await expect(()=>sut.execute({id:entity._id, password: '', oldPassword: '1234'}))
    .rejects.toThrow(new InvalidPasswordError('old password and new password are required'))
  });

  it('should throw an error when old password does not match', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const entity = new UserEntity(UserDataBuilder({password: hashPassword})) //é passado o hash pq o databuilder não converte
    repository.items = [entity]
    await expect(()=>sut.execute({id:entity._id, password: '4567', oldPassword: '12345'}))
    .rejects.toThrow(new InvalidPasswordError('old password does not match'))
  });

  it('should update a password', async () => {
    const hashPassword = await hashProvider.generateHash('1234')
    const spyUpdate = jest.spyOn(repository,'update')
    const items = [new UserEntity(UserDataBuilder({password: hashPassword}))] //é passado o hash pq o databuilder não converte
    repository.items = items

    const result = await sut.execute({id:items[0]._id, password:'4567', oldPassword: '1234'})
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    const checkNewPassword = await hashProvider.comparehash('4567',result.password)
    expect(checkNewPassword).toBeTruthy()
  });

});
