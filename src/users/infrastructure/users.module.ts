import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { SignupUseCase } from '../application/use_cases/signup.usecase';
import { BcryptjsHashProvider } from './providers/hash-provider/bcryptjs-hash.provider';
import { UserRepository } from '../domain/repositories/user.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';
import { SigninUseCase } from '../application/use_cases/signin.usecase';
import { GetUserUseCase } from '../application/use_cases/getuser.usecase';
import { ListUsersUseCase } from '../application/use_cases/listusers.usecase';
import { UpdateUserUseCase } from '../application/use_cases/update-user.usecase';
import { UpdatePasswordUseCase } from '../application/use_cases/update-password.usecase';
import { DeleteUserUseCase } from '../application/use_cases/delete-user.usecase';
import { PrismaService } from '@/shared/infrastructure/database/prisma/prisma.service';
import { UserPrismaRepository } from './database/prisma/repositories/user-prisma.repository';
import { AuthModule } from '@/auth/infrastructure/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UsersController],
  providers: [
    {
      provide: 'PrismaService',
      useClass: PrismaService,
    },
    {
      provide: 'UserRepository',
      useFactory: (prismaService: PrismaService) => {
        return new UserPrismaRepository(prismaService)
      },
      inject: ['PrismaService'],
    },
    {
      provide: 'HashProvider',
      useClass: BcryptjsHashProvider,
    },
    {
      provide: SignupUseCase.UseCase, //esse provide não muda, por isso o nome já é a classe
      useFactory: (userRepository: UserRepository.Repository, hashProvider: HashProvider) => {
        return new SignupUseCase.UseCase(userRepository,hashProvider)
      },
      inject: ['UserRepository','HashProvider'],
    },
    {
      provide: SigninUseCase.UseCase, //esse provide não muda, por isso o nome já é a classe
      useFactory: (userRepository: UserRepository.Repository, hashProvider: HashProvider) => {
        return new SigninUseCase.UseCase(userRepository,hashProvider)
      },
      inject: ['UserRepository','HashProvider'],
    },
    {
      provide: GetUserUseCase.UseCase, //esse provide não muda, por isso o nome já é a classe
      useFactory: (userRepository: UserRepository.Repository) => {
        return new GetUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: ListUsersUseCase.UseCase, //esse provide não muda, por isso o nome já é a classe
      useFactory: (userRepository: UserRepository.Repository) => {
        return new ListUsersUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdateUserUseCase.UseCase, //esse provide não muda, por isso o nome já é a classe
      useFactory: (userRepository: UserRepository.Repository) => {
        return new UpdateUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
    {
      provide: UpdatePasswordUseCase.UseCase, //esse provide não muda, por isso o nome já é a classe
      useFactory: (userRepository: UserRepository.Repository, hashProvider: HashProvider) => {
        return new UpdatePasswordUseCase.UseCase(userRepository,hashProvider)
      },
      inject: ['UserRepository','HashProvider'],
    },
    {
      provide: DeleteUserUseCase.UseCase, //esse provide não muda, por isso o nome já é a classe
      useFactory: (userRepository: UserRepository.Repository) => {
        return new DeleteUserUseCase.UseCase(userRepository)
      },
      inject: ['UserRepository'],
    },
  ],
})
export class UsersModule {}
