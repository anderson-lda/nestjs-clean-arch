import { Entity } from "@/shared/domain/entities/entity"
import { UserValidatorFactory } from "../validators/user.validator"
import { EntityValidationError } from "@/shared/domain/errors/validation-error"

export type UserProps = {
  name: string
  email: string
  password: string
  createdAt?: Date
}

export class UserEntity extends Entity<UserProps> {
  constructor(public readonly props: UserProps, id?: string) {
    UserEntity.validate(props)
    super(props, id)
    this.props.createdAt = this.props.createdAt ?? new Date()
  }

  update(value: string): void {
    UserEntity.validate({...this.props,name:value})
    this.name = value
  }

  updatePassword(value: string): void {
    UserEntity.validate({...this.props,password:value})
    this.password = value
  }

  get name(){
    return this.props.name
  }

  private set name(value: string){ //para não ser usado diretamente usa-se o private pois deve-se usar o update()
    this.props.name = value
  }

  get email(){
    return this.props.email
  }

  get password(){
    return this.props.password
  }

  private set password(value: string){ //para não ser usado diretamente usa-se o private pois deve-se usar o update()
    this.props.password = value
  }

  get createdAt(){
    return this.props.createdAt
  }

  static validate(props: UserProps){
    const validator = UserValidatorFactory.create()
    const isValid = validator.validate(props)
    if(!isValid){
      throw new EntityValidationError(validator.errors)
    }
  }
}
