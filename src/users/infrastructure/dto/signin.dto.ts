import { SigninUseCase } from "@/users/application/use_cases/signin.usecase";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SigninDto implements SigninUseCase.Input {
  @ApiProperty({description: 'Email do usuário'})
  @IsEmail()
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({description: 'Senha do usuário'})
  @IsString()
  @IsNotEmpty()
  password: string;
}
