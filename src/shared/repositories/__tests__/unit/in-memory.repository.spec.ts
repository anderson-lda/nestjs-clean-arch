import { Entity } from "@/shared/domain/entities/entity";
import { InMemoryRepository } from "../../in-memory.repository";
import { NotFoundError } from "@/shared/domain/errors/not-found-error";

type StubEntityProps = {
  name: string;
  price: number;
}

class StubEntity extends Entity<StubEntityProps>{}

class StubInMemoryRepository extends InMemoryRepository<StubEntity>{}

describe("InMemoryRepository unit tests", () => {
  let sut: StubInMemoryRepository

  beforeEach(()=>{
    sut = new StubInMemoryRepository()
  })

  it("Should inserts a new entity", async ()=>{
    const entity = new StubEntity({name: 'test name', price: 50})
    await sut.insert(entity)
    expect(entity.toJSON()).toStrictEqual(sut.items[0].toJSON())
  })

  it("Should throw error when entity not found", async ()=>{
    await expect(sut.findById('fakeId')).rejects.toThrow(
      new NotFoundError('entity not found')
    )
  })

  it("Should find an entity by id", async ()=>{
    const entity = new StubEntity({name: 'test name', price: 50})
    await sut.insert(entity)
    const result = await sut.findById(entity._id)
    await expect(entity.toJSON()).toStrictEqual(result.toJSON())
  })

  it("Should return all entities", async ()=>{
    const entity = new StubEntity({name: 'test name', price: 50})
    await sut.insert(entity)
    const result = await sut.findAll()
    await expect([entity]).toStrictEqual(result)
  })

  it("Should throw error on update when entity not found", async ()=>{
    const entity = new StubEntity({name: 'test name', price: 50})
    //no sut não existe pq não há o insert
    await expect(sut.update(entity)).rejects.toThrow(
      new NotFoundError('entity not found')
    )
  })

  it("Should update an entity", async ()=>{
    const entity = new StubEntity({name: 'test name', price: 50})
    await sut.insert(entity)
    const entityUpdated = new StubEntity({name: 'name updated', price: 10 }, entity._id,)
    await sut.update(entityUpdated)
    await expect(entityUpdated.toJSON()).toStrictEqual(sut.items[0].toJSON())
  })
})
