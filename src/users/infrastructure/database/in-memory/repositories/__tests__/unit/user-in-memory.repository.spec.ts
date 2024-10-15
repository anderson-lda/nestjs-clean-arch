import { UserEntity } from "@/users/domain/entities/user.entity"
import { UserInMemoryRepository } from "../../user-in-memory.repository"
import { userDataBuilder } from "@/users/domain/testing/helper/user-data-builder"
import { NotFoundError } from "rxjs"
import { ConflictError } from "@/shared/domain/errors/conflict-error"


describe("UserInMemoryRepository unit tests", () => {
  let sut: UserInMemoryRepository

  beforeEach(()=>{
    sut = new UserInMemoryRepository()
  })

  it("Should throw error when not found - findByEmail method", async ()=>{
     await expect(sut.findByEmail('a@a.com'))
     .rejects.toThrow(new NotFoundError('entity not found using email a@a.com'))
  })

  it("Should find an entity by email - findByEmail method", async ()=>{
    const entity = new UserEntity(userDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findByEmail(entity.email)
    expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it("Should throw error when not found - emailExists method", async ()=>{
    const entity = new UserEntity(userDataBuilder({}))
    await sut.insert(entity)

    await expect(sut.emailExists(entity.email))
    .rejects.toThrow(new ConflictError('email address already used'))
   })

  it("Shouldn't find an entity by email - emailExists method", async ()=>{
    expect.assertions(0)
    await sut.emailExists('a@a.com')
  })
})
