import { SigninUseCase } from "@/users/application/use_cases/signin.usecase";

export class SigninDto implements SigninUseCase.Input {
  email: string;
  password: string;
}
