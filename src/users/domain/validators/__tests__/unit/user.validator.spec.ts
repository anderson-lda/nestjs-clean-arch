import { userDataBuilder } from "@/users/domain/testing/helper/user-data-builder"
import { UserRules, UserValidator, UserValidatorFactory } from "../../user.validator"

let sut: UserValidator

describe("UserValidator unit tests", () => {
  beforeEach(()=>{
    sut = UserValidatorFactory.create()
  })
  describe("name field",()=>{
    it("Invalidation cases for name field",()=>{
      let isValid = sut.validate(null as any)
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
        'name must be a string',
        'name must be shorter than or equal to 255 characters'
      ])

      isValid = sut.validate({
        ...userDataBuilder({}),
        name: '' as any,
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name should not be empty',
      ])

      isValid = sut.validate({
        ...userDataBuilder({}),
        name: 10 as any,
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name must be a string',
        'name must be shorter than or equal to 255 characters',
      ])

      isValid = sut.validate({
        ...userDataBuilder({}),
        name: 'a'.repeat(256),
      })
      expect(isValid).toBeFalsy()
      expect(sut.errors['name']).toStrictEqual([
        'name must be shorter than or equal to 255 characters',
      ])
    })

    it('valid case for name field',()=>{
      const props = userDataBuilder({})
      const isValid = sut.validate(props)
      expect(isValid).toBeTruthy()
      expect(sut.validatedData).toStrictEqual(new UserRules(props))
    })
  })
})
