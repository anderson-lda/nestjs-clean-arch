import { UserInMemoryRepository } from "@/users/infrastructure/database/in-memory/repositories/user-in-memory.repository";
import { SignupUseCase } from "../../signup.usecase";
import { HashProvider } from "@/shared/application/providers/hash-provider";
import { BcryptjsHashProvider } from "@/users/infrastructure/providers/hash-provider/bcryptjs-hash.provider";
import { UserDataBuilder } from "@/users/domain/testing/helper/user-data-builder";
import { ConflictError } from "@/shared/domain/errors/conflict-error";
import { BadRequestError } from "@/shared/application/errors/bad-request-error";

describe('SignupUseCase unit tests', () => {
  let sut: SignupUseCase.UseCase;
  let repository: UserInMemoryRepository //poderia ser userrepository.repository
  let hashProvider: HashProvider //poderia ser o bcrypt direto

  beforeEach(() => {
    repository = new UserInMemoryRepository()
    hashProvider = new BcryptjsHashProvider()
    sut = new SignupUseCase.UseCase(repository,hashProvider)
  });

  it('should create a user', async () => {
    const spyInsert = jest.spyOn(repository,'insert')
    const props = UserDataBuilder({})
    const result = await sut.execute(props)
    expect(result.id).toBeDefined()
    expect(result.createdAt).toBeInstanceOf(Date)
    expect(spyInsert).toHaveBeenCalledTimes(1)
  });

  it('should not be able to register with same email twice', async () => {
    const props = UserDataBuilder({email:'a@a.com'})
    await sut.execute(props)

    await expect(()=>sut.execute(props)).rejects.toBeInstanceOf(ConflictError)
  });

  it('should throw error when name not provided', async () => {
    const props = Object.assign(UserDataBuilder({}),{name:null})

    await expect(()=>sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  });

  it('should throw error when email not provided', async () => {
    const props = Object.assign(UserDataBuilder({}),{email:null})

    await expect(()=>sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  });

  it('should throw error when password not provided', async () => {
    const props = Object.assign(UserDataBuilder({}),{password:null})

    await expect(()=>sut.execute(props)).rejects.toBeInstanceOf(BadRequestError)
  });
});
