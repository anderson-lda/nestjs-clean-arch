import { UsersController } from '../../users.controller';
import { UserOutput } from '@/users/application/dto/user-output';
import { SignupUseCase } from '@/users/application/use_cases/signup.usecase';
import { SignupDto } from '../../dto/signup.dto';

describe('UsersController unit tests', () => {
  let sut: UsersController;
  let id: string
  let props: UserOutput

  beforeEach(async () => {
    sut = new UsersController()
    id = '0cf54b69-197c-4a19-a21f-5d85b6070350'
    props = {
      id,
      name: 'Joseph',
      email: 'a@a.com',
      password: '1234',
      createdAt: new Date()
    }

  });

  it('should be defined', () => {
    expect(sut).toBeDefined();
  });

  it('should create a user', async () => {
    const output: SignupUseCase.Output = props
    const mockSignupUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(output))
    }
    sut['signupUseCase'] = mockSignupUseCase as any
    const input: SignupDto = {
      name: 'Joseph',
      email: 'a@a.com',
      password: '1234',
    }
    const result = await sut.create(input)
    expect(output).toMatchObject(result);
    expect(mockSignupUseCase.execute).toHaveBeenCalledWith(input)
  });
});
