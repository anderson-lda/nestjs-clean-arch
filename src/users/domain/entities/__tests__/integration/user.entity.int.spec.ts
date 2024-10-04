import { userDataBuilder } from "@/users/domain/testing/helper/user-data-builder"
import { UserEntity, UserProps } from "../../user.entity"
import { EntityValidationError } from "@/shared/domain/errors/validation-error"

describe("UserEntity integration tests",()=>{
  describe("Constructor method",()=>{
    it("Should throw an error when create a user with an invalid name",()=>{
      let props: UserProps = {
        ...userDataBuilder({}),
        name: null,
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...userDataBuilder({}),
        name: '',
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...userDataBuilder({}),
        name: 'a'.repeat(256),
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)
    })
  })
})
