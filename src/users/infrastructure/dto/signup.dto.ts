import { SignupUseCase } from "@/users/application/use_cases/signup.usecase";

export class SignupDto implements SignupUseCase.Input {
  name: string;
  email: string;
  password: string;
}
