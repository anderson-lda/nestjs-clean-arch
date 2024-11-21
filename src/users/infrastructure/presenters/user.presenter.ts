import { CollectionPresenter } from "@/shared/infrastructure/presenters/collection.presenter"
import { UserOutput } from "@/users/application/dto/user-output"
import { ListUsersUseCase } from "@/users/application/use_cases/listusers.usecase"
import { Transform } from "class-transformer"

export class UserPresenter {
  id: string
  name: string
  email: string
  @Transform(({value}: {value: Date})=>value.toISOString())
  createdAt: Date

  constructor(output: UserOutput){
    this.id = output.id
    this.name = output.name
    this.email = output.email
    this.createdAt = output.createdAt
  }
}

export class UserCollectionPresenter extends CollectionPresenter {
  data: UserPresenter[]

  constructor(output: ListUsersUseCase.Output){
    const {items, ...paginationProps} = output //paginationProps é todo o resto fora items
    super(paginationProps)
    this.data = items.map(item => new UserPresenter(item))
  }
}
