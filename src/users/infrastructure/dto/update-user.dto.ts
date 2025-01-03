import { UpdateUserUseCase } from "@/users/application/use_cases/update-user.usecase";
import { ApiPropertyOptional } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input,'id'> { //id é passado por params, não no body
  @ApiPropertyOptional({description: 'Nome do usuário'})
  @IsString()
  @IsNotEmpty()
  name: string;
}
