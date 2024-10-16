import { UserRepository } from "@/users/domain/repositories/user.repository"
import { BadRequestError } from "../errors/bad-request-error"
import { UserEntity } from "@/users/domain/entities/user.entity"

export namespace SignupUseCase {
  export type Input = {
    name: string
    email: string
    password: string
  }

  export type Output = {
    name: string
    email: string
    password: string
    id: string
    createdAt: Date
  }

  export class UseCase {
    constructor(private userRepository: UserRepository.Repository){}

    async execute(input: Input): Promise<Output> {
      const {email,name,password} = input

      if(!email || !name || !password){
        throw new BadRequestError('Input data not complete')
      }

      await this.userRepository.emailExists(email)

      const entity = new UserEntity(input)
      await this.userRepository.insert(entity)

      return entity.toJSON()
    }
  }
}
