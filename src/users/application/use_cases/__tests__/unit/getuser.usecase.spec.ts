import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { UserDataBuilder } from "@/users/domain/testing/helper/user-data-builder";
import { GetUserUseCase } from "../../getuser.usecase";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { UserEntity } from "@/users/domain/entities/user.entity";

describe('GetUserUseCase unit tests', () => {
  let sut: GetUserUseCase.UseCase;
  let repository: UserInMemoryRepository //poderia ser userrepository.repository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new GetUserUseCase.UseCase(repository)
  });

  it('should throws an error when the entity is not found', async () => {
    await expect(()=>sut.execute({id:'fake_id'})).rejects.toThrow(new NotFoundError('entity not found'))
  });

  it('should be able to get user profile', async () => {
    const spyFindById = jest.spyOn(repository,'findById')
    const items = [new UserEntity(UserDataBuilder({}))]
    repository.items = items

    const result = await sut.execute({id:items[0]._id})
    expect(spyFindById).toHaveBeenCalledTimes(1)
    expect(result).toMatchObject({
      id: items[0].id,
      name: items[0].name,
      email: items[0].email,
      password: items[0].password,
      createdAt: items[0].createdAt,
    })
  });

});
