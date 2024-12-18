import { UserEntity } from "../entities/user.entity"
import {
  SearchableRepositoryInterface,
  SearchParams as DefaultSearchParams,
  SearchResult as DefaultSearchResult,
} from "@/shared/domain/repositories/searchable-repository-contracts"

export namespace UserRepository {
  export type Filter = string

  //estão sendo criadas aqui para permitir a sobrescrita em algum momento caso desejado
  export class SearchParams extends DefaultSearchParams<Filter> {}
  export class SearchResult extends DefaultSearchResult<UserEntity,Filter> {}

  export interface Repository extends SearchableRepositoryInterface<
  UserEntity, Filter,SearchParams, SearchResult>{
    findByEmail(email: string): Promise<UserEntity>
    emailExists(email: string): Promise<void>
  }
}
