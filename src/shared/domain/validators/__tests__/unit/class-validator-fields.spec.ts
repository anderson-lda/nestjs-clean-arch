import { classValidatorFields } from "../../class-validator-fields";
import * as libClassValidator from 'class-validator'

class StubClassValidatorFields extends classValidatorFields<{field: string}>{}

describe("ClassValidatorFields unit tests", () => {
  it("Should initiazile errors and validateddata variable with null",()=>{
    const sut = new StubClassValidatorFields()

    expect(sut.errors).toBeNull()
    expect(sut.validatedData).toBeNull()
  })

  it("Should validate with errors",()=>{
    const spyValidateSync = jest.spyOn(libClassValidator,'validateSync')
    spyValidateSync.mockReturnValue([
      { property: 'field', constraints: {isRequired: 'test error'} },
    ])
    const sut = new StubClassValidatorFields()

    expect(sut.validate(null)).toBeFalsy()
    expect(spyValidateSync).toHaveBeenCalled()
    expect(sut.validatedData).toBeNull()
    expect(sut.errors).toStrictEqual({field: ['test error']})
  })
})
