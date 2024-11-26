import { UpdateUserUseCase } from "@/users/application/use_cases/update-user.usecase";
import { IsNotEmpty, IsString } from "class-validator";

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input,'id'> { //id é passado por params, não no body
  @IsString()
  @IsNotEmpty()
  name: string;
}
