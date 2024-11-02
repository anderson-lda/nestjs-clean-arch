import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { SignupUseCase } from '../application/use_cases/signup.usecase';
import { UserInMemoryRepository } from './database/in-memory/repositories/user-in-memory.repository';
import { BcryptjsHashProvider } from './providers/hash-provider/bcryptjs-hash.provider';
import { UserRepository } from '../domain/repositories/user.repository';
import { HashProvider } from '@/shared/application/providers/hash-provider';

@Module({
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: 'UserRepository', //o useClass pode mudar (prisma ou inmemory, por ex)
      useClass: UserInMemoryRepository,
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
    }],
})
export class UsersModule {}
