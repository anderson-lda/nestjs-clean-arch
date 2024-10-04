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
        name: 10 as any,
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...userDataBuilder({}),
        name: 'a'.repeat(256),
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)
    })

    it("Should throw an error when create a user with an invalid email",()=>{
      let props: UserProps = {
        ...userDataBuilder({}),
        email: null,
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...userDataBuilder({}),
        email: '',
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...userDataBuilder({}),
        email: 10 as any,
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...userDataBuilder({}),
        email: 'a'.repeat(256),
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)
    })

    it("Should throw an error when create a user with an invalid password",()=>{
      let props: UserProps = {
        ...userDataBuilder({}),
        password: null,
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...userDataBuilder({}),
        password: '',
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...userDataBuilder({}),
        password: 10 as any,
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...userDataBuilder({}),
        password: 'a'.repeat(101),
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)
    })
  })
})
