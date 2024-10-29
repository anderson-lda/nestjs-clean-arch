import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserDataBuilder } from "@/users/domain/testing/helper/user-data-builder"
import { UserOutputMapper } from "../../user-output"

describe('UserOutputMapper unit tests',()=>{
  it('Should convert an user in output',()=>{
    const entity = new UserEntity(UserDataBuilder({}))
    const spyToJson = jest.spyOn(entity,'toJSON')
    const sut = UserOutputMapper.toOutput(entity)

    expect(spyToJson).toHaveBeenCalled()
    expect(sut).toStrictEqual(entity.toJSON())
  })
})
