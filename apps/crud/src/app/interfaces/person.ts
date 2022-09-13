export interface IPerson {
  imgUrl: string
  phone: string
  age: number
  address: IAddress
  company: string
  name: string
  isActive: boolean
  level: string
}

export interface IAddress {
  street: string
  number: number
}

export  interface IPersonPagination {
  items: IPerson[],
  page: number,
  pageSize: number,
  totalItems: number,
}
