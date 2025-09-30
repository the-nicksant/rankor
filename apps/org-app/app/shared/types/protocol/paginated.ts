export interface Paginated<T = any> {
  data: T[]
  total: number
}