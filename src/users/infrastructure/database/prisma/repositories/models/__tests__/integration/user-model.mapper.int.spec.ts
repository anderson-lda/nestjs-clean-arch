import { PrismaClient, User } from "@prisma/client"
import { execSync } from "node:child_process"
import { UserModelMapper } from "../../user-model.mapper"
import { ValidationError } from "@/shared/domain/errors/validation-error"
import { UserEntity } from "@/users/domain/entities/user.entity"
import { setupPrismaTests } from "@/shared/infrastructure/database/prisma/testing/setup-prisma-tests"

describe('UserModelMapper integration tests',()=>{
  let prismaService: PrismaClient
  let props: any

  beforeAll(async ()=>{
    setupPrismaTests()
    prismaService = new PrismaClient()
    await prismaService.$connect()
  })

  beforeEach(async ()=>{
    await prismaService.user.deleteMany()
    props = {
      name: 'Joseph',
      id: '63aca5c3-a600-443f-9113-67f5004c4b4d',
      email: 'a@a.com',
      password: '1234',
      createdAt: new Date(),
    }
  })

  afterAll(async ()=>{
    await prismaService.$disconnect()
  })

  it('should throws error when user model is invalid',async ()=>{
    const model: User = Object.assign(props,{name: null})

    expect(()=>UserModelMapper.toEntity(model)).toThrow(ValidationError)
  })

  it('should convert a user model to user entity',async ()=>{
    const model: User = await prismaService.user.create({data: props})
    const sut = UserModelMapper.toEntity(model)

    expect(sut).toBeInstanceOf(UserEntity)
    expect(sut.toJSON()).toStrictEqual(props)
  })

})
