import { UserEntity, UserProps } from '../../user.entity'
import { UserDataBuilder } from '@/users/domain/testing/helper/user-data-builder'

describe("UserEntity unit tests",() => {
  let props: UserProps
  let sut: UserEntity

  beforeEach(() => {
    UserEntity.validate = jest.fn() //função que não faz nada, usada aqui para criar uma simulação
    props = UserDataBuilder({})

    sut = new UserEntity(props)
  })

  it('Constructor method',() => {
    expect(UserEntity.validate).toHaveBeenCalled()
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.email).toEqual(props.email)
    expect(sut.props.password).toEqual(props.password)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })

  it('Getter of name field',()=>{
    expect(sut.name).toBeDefined()
    expect(sut.name).toEqual(props.name)
    expect(typeof sut.name).toBe('string')
  })

  it('Getter of email field',()=>{
    expect(sut.email).toBeDefined()
    expect(sut.email).toEqual(props.email)
    expect(typeof sut.email).toBe('string')
  })

  it('Getter of password field',()=>{
    expect(sut.password).toBeDefined()
    expect(sut.password).toEqual(props.password)
    expect(typeof sut.password).toBe('string')
  })

  it('Getter of createdAt field',()=>{
    expect(sut.createdAt).toBeDefined()
    expect(sut.createdAt).toBeInstanceOf(Date)
  })

  it('Setter of name field',()=>{
    sut['name'] = 'other name' //escrito dessa forma porque não é permitido atribuições diretas
    expect(sut.props.name).toEqual('other name')
    expect(typeof sut.props.name).toBe('string')
  })

  it('Setter of password field',()=>{
    sut['password'] = 'other password' //escrito dessa forma porque não é permitido atribuições diretas
    expect(sut.props.password).toEqual('other password')
    expect(typeof sut.props.password).toBe('string')
  })

  it('Should update a user',()=>{
    sut.update('other name')
    expect(UserEntity.validate).toHaveBeenCalled()
    expect(sut.props.name).toEqual('other name')
  })

  it('Should update the password field',()=>{
    sut.updatePassword('other password')
    expect(UserEntity.validate).toHaveBeenCalled()
    expect(sut.props.password).toEqual('other password')
  })
})
