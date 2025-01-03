import { SignupUseCase } from "@/users/application/use_cases/signup.usecase";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class SignupDto implements SignupUseCase.Input {
  @ApiProperty({description: 'Nome do usuário'})
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({description: 'Email do usuário'})
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({description: 'Senha do usuário'})
  @IsString()
  @IsNotEmpty()
  password: string;
}
