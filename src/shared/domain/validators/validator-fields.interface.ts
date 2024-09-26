export type FieldErrors = {
  [field: string]: string[]
}

//interface é importante porque, no futuro, pode ser que mude as bibliotecas utilizadas, mas, a implementação tem que ser seguida e isso traz mais segurança
export interface ValidatorFieldsInterface<PropsValidated>{
  errors: FieldErrors
  validatedData: PropsValidated
  validate(data: any): boolean
}
