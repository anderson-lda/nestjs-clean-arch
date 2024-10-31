import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { UserDataBuilder } from "@/users/domain/testing/helper/user-data-builder";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";
import { UserEntity } from "@/users/domain/entities/user.entity";
import { DeleteUserUseCase } from "../../delete-user.usecase";

describe('DeleteUserUseCase unit tests', () => {
  let sut: DeleteUserUseCase.UseCase;
  let repository: UserInMemoryRepository //poderia ser userrepository.repository

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    sut = new DeleteUserUseCase.UseCase(repository)
  });

  it('should throws an error when the entity is not found', async () => {
    await expect(()=>sut.execute({id:'fake_id'}))
    .rejects.toThrow(new NotFoundError('entity not found'))
  });

  it('should delete a user', async () => {
    const spyDelete = jest.spyOn(repository,'delete')
    const items = [new UserEntity(UserDataBuilder({}))]
    repository.items = items

    expect(repository.items).toHaveLength(1)
    await sut.execute({id:items[0]._id})
    expect(spyDelete).toHaveBeenCalledTimes(1)
    expect(repository.items).toHaveLength(0)
  });

});
