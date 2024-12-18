import { UserRepository } from "@/users/domain/repositories/user.repository"
import { UserOutput, UserOutputMapper } from "../dto/user-output"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { InvalidPasswordError } from "@/shared/application/errors/invalid-password-error"
import { HashProvider } from "@/shared/application/providers/hash-provider"

export namespace UpdatePasswordUseCase {
  export type Input = {
    id: string
    password: string
    oldPassword: string
  }

  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input,Output> {
    constructor(
      private userRepository: UserRepository.Repository,
      private hashProvider: HashProvider,
    ){}

    async execute(input: Input): Promise<Output> {
      const entity = await this.userRepository.findById(input.id) //se o id não for válido, a exceção será lançada no lado do repositório
      if(!input.password || !input.oldPassword){
        throw new InvalidPasswordError('old password and new password are required')
      }
      const checkOldPassword = await this.hashProvider.comparehash(input.oldPassword,entity.password)
      if(!checkOldPassword){
        throw new InvalidPasswordError('old password does not match')
      }
      const hashPassword = await this.hashProvider.generateHash(input.password)
      entity.updatePassword(hashPassword)//DDD: é a própria entidade que faz alterações nela mesma
      await this.userRepository.update(entity) //salvando no banco de dados
      return UserOutputMapper.toOutput(entity)
    }
  }
}
