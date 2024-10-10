import { Entity } from "../domain/entities/entity";
import { InMemoryRepository } from "./in-memory.repository";
import { SearchableRepositoryInterface } from "./searchable-repository-contracts";

//abstract: não tem uma entidade específica para manipular
export abstract class InMemorySearchableRepository<E extends Entity>
extends InMemoryRepository<E>
implements SearchableRepositoryInterface<E, any, any> {
  search(props: any): Promise<any> {
    throw new Error("Method not implemented.");
  }

}

