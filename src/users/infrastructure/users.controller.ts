import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, HttpCode, Query, Put, UseGuards } from '@nestjs/common';
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
import { AuthService } from '@/auth/infrastructure/auth.service';
import { AuthGuard } from '@/auth/infrastructure/auth.guard';
import { ApiBearerAuth, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';

@ApiTags('users')
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

  @Inject(AuthService)
  private authService: AuthService

  static userToResponse(output: UserOutput) {
    return new UserPresenter(output)
  }

  static listUsersToResponse(output: ListUsersUseCase.Output){
    return new UserCollectionPresenter(output)
  }

  @ApiResponse({
    status: 409,
    description: 'Conflito de email',
  })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @Post()
  async create(@Body() signupDto: SignupDto) {
    const output = await this.signupUseCase.execute(signupDto);
    return UsersController.userToResponse(output)
  }

  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        accessToken: {
          type: 'string',
        }
      }
    }
  })
  @ApiResponse({
    status: 422,
    description: 'Corpo da requisição com dados inválidos',
  })
  @ApiResponse({
    status: 404,
    description: 'Email não encontrado',
  })
  @ApiResponse({
    status: 400,
    description: 'Credenciais inválidas',
  })
  @HttpCode(200)
  @Post('login')
  async login(@Body() signinDto: SigninDto) {
    const output =  await this.signinUseCase.execute(signinDto);
    return this.authService.generateJwt(output.id)
  }

  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    schema: {
      type: 'object',
      properties: {
        meta: {
          type: 'object',
          properties: {
            total: {
              type: 'number',
            },
            currentPage: {
              type: 'number',
            },
            lastPage: {
              type: 'number',
            },
            perPage: {
              type: 'number',
            }
          }
        },
        data: {
          type: 'array',
          items: { $ref: getSchemaPath(UserPresenter) }
        }
      }
    }
  })
  @ApiResponse({
    status: 422,
    description: 'Parâmetros de consulta inválidos',
  })
  @ApiResponse({
    status: 401,
    description: 'Acesso não autorizado',
  })
  @UseGuards(AuthGuard)
  @Get()
  async search(@Query() searchParams: ListUsersDto) {
    const output = await this.listUsersUseCase.execute(searchParams);
    return UsersController.listUsersToResponse(output)
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const output = await this.getUserUseCase.execute({id});
    return UsersController.userToResponse(output)
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const output = await this.updateUserUseCase.execute({id, ...updateUserDto});//spread operator para passar objeto para dentro de outro
    return UsersController.userToResponse(output)
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async updatePassword(@Param('id') id: string, @Body() updatePasswordDto: UpdatePasswordDto) {
    const output = await this.updatePasswordUseCase.execute({id, ...updatePasswordDto});//spread operator para passar objeto para dentro de outro
    return UsersController.userToResponse(output)
  }

  @UseGuards(AuthGuard)
  @HttpCode(204)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.deleteUserUseCase.execute({id});
  }
}
