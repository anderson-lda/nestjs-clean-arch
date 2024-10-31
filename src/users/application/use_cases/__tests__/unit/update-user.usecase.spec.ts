import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { UserDataBuilder } from "@/users/domain/testing/helper/user-data-builder";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { UpdateUserUseCase } from "../../update-user.usecase";
import { BadRequestError } from "@/shared/application/errors/bad-request-error";

describe('UpdateUserUseCase unit tests', () => {
  let sut: UpdateUserUseCase.UseCase;
  let repository: UserInMemoryRepository //poderia ser userrepository.repository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new UpdateUserUseCase.UseCase(repository)
  });

  it('should throws an error when the entity is not found', async () => {
    await expect(()=>sut.execute({id:'fake_id', name: 'test_name'})).rejects.toThrow(new NotFoundError('entity not found'))
  });

  it('should throws an error when the name field is empty', async () => {
    await expect(()=>sut.execute({id:'fake_id', name: ''})).rejects.toThrow(new BadRequestError('name not provided'))
  });

  it('should update a user', async () => {
    const spyUpdate = jest.spyOn(repository,'update')
    const items = [new UserEntity(UserDataBuilder({}))]
    repository.items = items

    const result = await sut.execute({id:items[0]._id, name:'new name'})
    expect(spyUpdate).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      id: items[0].id,
      name: 'new name',
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
  });

});
