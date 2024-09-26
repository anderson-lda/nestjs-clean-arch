import { v4 as uuidv4 } from 'uuid'
//uuid é exceção de bibliotecas usadas em entities da clean architecture

export abstract class Entity<Props = any> {
  public readonly _id: string
  public readonly props: Props

  constructor(props: Props, id?: string){
    this.props = props
    this._id = id || uuidv4()
  }

  get id(){
    return this.id
  }

  //required torna obrigatório os parâmetros de entrada
  toJSON(): Required<{id: string} & Props>{
    return {
      id: this._id,
      ...this.props,
    } as Required<{id: string} & Props>
  }
}
