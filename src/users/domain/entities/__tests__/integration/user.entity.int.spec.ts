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

    it("Should throw an error when create a user with an invalid createdAt",()=>{
      let props: UserProps = {
        ...userDataBuilder({}),
        createdAt: '2023' as any, //precisa do as any pra tirar o alerta
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)

      props = {
        ...userDataBuilder({}),
        createdAt: 10 as any,
      }
      expect(()=>new UserEntity(props)).toThrow(EntityValidationError)
    })

    it("Should a valid user",()=>{
      expect.assertions(0)
      const props: UserProps = {
        ...userDataBuilder({}),
      }
      new UserEntity(props)
    })
  })

  describe("Update method",()=>{
    it("Should throw an error when update a user with an invalid name",()=>{
      const entity = new UserEntity(userDataBuilder({}))
      expect(()=>entity.update(null)).toThrow(EntityValidationError)
      expect(()=>entity.update('')).toThrow(EntityValidationError)
      expect(()=>entity.update(10 as any)).toThrow(EntityValidationError)
      expect(()=>entity.update('a'.repeat(256))).toThrow(EntityValidationError)
    })

    it("Should a valid user",()=>{
      expect.assertions(0)
      const props: UserProps = {
        ...userDataBuilder({}),
      }
      const entity = new UserEntity(props)
      entity.update('other name')
    })
  })
})
