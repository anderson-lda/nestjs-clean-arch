import { instanceToPlain } from "class-transformer";
import { UserPresenter } from "../../user.presenter";

describe('UserPresenter unit tests', () => {
  const createdAt = new Date()
  let props = {
    id: '0cf54b69-197c-4a19-a21f-5d85b6070350',
    name: 'Test Name',
    email: 'a@a.com',
    password: 'fake',
    createdAt,
  }
  let sut: UserPresenter

  beforeEach(()=>{
    sut = new UserPresenter(props)
  })
  describe('constructor',()=>{
    it('should be defined', () => {
      expect(sut.id).toEqual(props.id)
      expect(sut.name).toEqual(props.name)
      expect(sut.email).toEqual(props.email)
      expect(sut.createdAt).toEqual(props.createdAt)
    });
  })

  it('should presenter data', () => {
    const output = instanceToPlain(sut)

    expect(output).toStrictEqual({
      id: '0cf54b69-197c-4a19-a21f-5d85b6070350',
    name: 'Test Name',
    email: 'a@a.com',
    createdAt: createdAt.toISOString(),
    })
  });
})
