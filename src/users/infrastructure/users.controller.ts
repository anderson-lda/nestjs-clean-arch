import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpCode, Query, Put } from '@nestjs/common';
import { SignupDto } from './dto/signup.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { SignupUseCase } from '../application/use_cases/signup.usecase';
import { SigninUseCase } from '../application/use_cases/signin.usecase';
import { UpdateUserUseCase } from '../application/use_cases/update-user.usecase';
import { UpdatePasswordUseCase } from '../application/use_cases/update-password.usecase';
import { DeleteUserUseCase } from '../application/use_cases/delete-user.usecase';
import { GetUserUseCase } from '../application/use_cases/getuser.usecase';
import { ListUsersUseCase } from '../application/use_cases/listusers.usecase';
import { SigninDto } from './dto/signin.dto';
import { ListUsersDto } from './dto/list-users.dto';
import { UpdatePasswordDto } from './dto/update-password.dto';
import { UserOutput } from '../application/dto/user-output';
import { UserCollectionPresenter, UserPresenter } from './presenters/user.presenter';

@Controller('users')
export class UsersController {
  @Inject(SignupUseCase.UseCase)
  private signupUseCase: SignupUseCase.UseCase

  @Inject(SigninUseCase.UseCase)
  private signinUseCase: SigninUseCase.UseCase

  @Inject(UpdateUserUseCase.UseCase)
  private updateUserUseCase: UpdateUserUseCase.UseCase

  @Inject(UpdatePasswordUseCase.UseCase)
  private updatePasswordUseCase: UpdatePasswordUseCase.UseCase

  @Inject(DeleteUserUseCase.UseCase)
  private deleteUserUseCase: DeleteUserUseCase.UseCase

  @Inject(GetUserUseCase.UseCase)
  private getUserUseCase: GetUserUseCase.UseCase

  @Inject(ListUsersUseCase.UseCase)
  private listUsersUseCase: ListUsersUseCase.UseCase

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output)
  }

  static listUsersToResponse(output: ListUsersUseCase.Output){
    return new UserCollectionPresenter(output)
  }

  @Post()
  async create(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);
    return UsersController.userToResponse(output)
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() signinDto: SigninDto) {
    const output =  await this.signinUseCase.execute(signinDto);
    return UsersController.userToResponse(output)
  }

  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams);
    return UsersController.listUsersToResponse(output)
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({id});
    return UsersController.userToResponse(output)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({id, ...updateUserDto});//spread operator para passar objeto para dentro de outro
    return UsersController.userToResponse(output)
  }

  @Patch(':id')
  async updatePassword(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    const output = await this.updatePasswordUseCase.execute({id, ...updatePasswordDto});//spread operator para passar objeto para dentro de outro
    return UsersController.userToResponse(output)
  }

  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({id});
  }
}
