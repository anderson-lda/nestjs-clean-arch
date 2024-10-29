import { UserEntity } from "@/users/domain/entities/user.entity"

export type UserOutput = {
  name: string
  email: string
  password: string
  id: string
  createdAt: Date
}

export class UserOutputMapper {
  static toOutput(entity: UserEntity): UserOutput {
    return entity.toJSON()
  }
}
