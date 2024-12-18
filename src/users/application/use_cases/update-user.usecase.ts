import { UserRepository } from "@/users/domain/repositories/user.repository"
import { UserOutput, UserOutputMapper } from "../dto/user-output"
import { UseCase as DefaultUseCase } from "@/shared/application/usecases/use-case"
import { BadRequestError } from "@/shared/application/errors/bad-request-error"

export namespace UpdateUserUseCase {
  export type Input = {
    id: string
    name: string
  }

  export type Output = UserOutput

  export class UseCase implements DefaultUseCase<Input,Output> {
    constructor(
      private userRepository: UserRepository.Repository,
    ){}

    async execute(input: Input): Promise<Output> {
      if(!input.name) {
        throw new BadRequestError('name not provided')
      }
      const entity = await this.userRepository.findById(input.id) //se o id não for válido, a exceção será lançada no lado do repositório
      entity.update(input.name) //DDD: a entidade é alterada por ela mesma
      await this.userRepository.update(entity)
      return UserOutputMapper.toOutput(entity)
    }
  }
}
