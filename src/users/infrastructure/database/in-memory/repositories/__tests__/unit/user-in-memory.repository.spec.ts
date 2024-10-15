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


  it("Should not filter items when filter object is null ", async ()=>{
    const entity = new UserEntity(userDataBuilder({}))
    await sut.insert(entity)
    const result = await sut.findAll()
    const spyFilter = jest.spyOn(result,'filter')
    const itemsFiltered = await sut['applyFilter'](result,null)
    expect(spyFilter).not.toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual(result)
  })

  it("Should filter name field using filter param ", async ()=>{
    const items = [
      new UserEntity(userDataBuilder({name:'Test'})),
      new UserEntity(userDataBuilder({name:'TEST'})),
      new UserEntity(userDataBuilder({name:'fake'})),
    ]
    const spyFilter = jest.spyOn(items,'filter')
    const itemsFiltered = await sut['applyFilter'](items,'TEST')
    expect(spyFilter).toHaveBeenCalled()
    expect(itemsFiltered).toStrictEqual([items[0],items[1]])
  })

  it("Should sort by createdAt when sort param is null ", async ()=>{
    const createdAt = new Date()
    const items = [
      new UserEntity(userDataBuilder({name:'Test', createdAt})),
      new UserEntity(userDataBuilder({name:'TEST', createdAt: new Date(createdAt.getTime() + 1)})),
      new UserEntity(userDataBuilder({name:'fake', createdAt: new Date(createdAt.getTime() + 2)})),
    ]
    const itemsSorted = await sut['applySort'](items,null,null)
    expect(itemsSorted).toStrictEqual([items[2],items[1],items[0]])
  })

  it("Should sort by name field", async ()=>{
    const createdAt = new Date()
    const items = [
      new UserEntity(userDataBuilder({name:'c'})),
      new UserEntity(userDataBuilder({name:'d'})),
      new UserEntity(userDataBuilder({name:'a'})),
    ]
    let itemsSorted = await sut['applySort'](items,'name','asc') //maiúsculos precendem os minúsculos em JS
    expect(itemsSorted).toStrictEqual([items[2],items[0],items[1]])

    itemsSorted = await sut['applySort'](items,'name',null) //maiúsculos precendem os minúsculos em JS
    expect(itemsSorted).toStrictEqual([items[1],items[0],items[2]])

  })
})
