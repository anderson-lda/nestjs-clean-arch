import { CollectionPresenter } from "@/shared/infrastructure/presenters/collection.presenter"
import { UserOutput } from "@/users/application/dto/user-output"
import { ListUsersUseCase } from "@/users/application/use_cases/listusers.usecase"
import { ApiProperty } from "@nestjs/swagger"
import { Transform } from "class-transformer"

export class UserPresenter {
  @ApiProperty({description: 'Identificação do usuário'})
  id: string

  @ApiProperty({description: 'Nome do usuário'})
  name: string

  @ApiProperty({description: 'Email do usuário'})
  email: string

  @ApiProperty({description: 'Data de criação do usuário'})
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
