import { UpdateUserUseCase } from "@/users/application/use_cases/update-user.usecase";

export class UpdateUserDto implements Omit<UpdateUserUseCase.Input,'id'> { //id é passado por params, não no body
  name: string;
}
