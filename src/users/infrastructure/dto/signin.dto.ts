import { SigninUseCase } from "@/users/application/use_cases/signin.usecase";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SigninDto implements SigninUseCase.Input {
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;
  @IsString()
  @IsNotEmpty()
  password: string;
}
