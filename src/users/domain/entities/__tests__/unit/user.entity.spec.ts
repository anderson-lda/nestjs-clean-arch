import { UserEntity, UserProps } from '../../user.entity'
import { userDataBuilder } from '@/users/domain/testing/helper/user-data-builder'

describe("UserEntity unit tests",() => {
  let props: UserProps
  let sut: UserEntity

  beforeEach(() => {
    props = userDataBuilder({})

    sut = new UserEntity(props)
  })

  it('Constructor method',() => {
    expect(sut.props.name).toEqual(props.name)
    expect(sut.props.email).toEqual(props.email)
    expect(sut.props.password).toEqual(props.password)
    expect(sut.props.createdAt).toBeInstanceOf(Date)
  })
})
