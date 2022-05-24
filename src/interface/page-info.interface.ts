export interface Pagination<T> {
  pageNumber: string;
  pageSize: string;
  data: T;
  total: number;
}

export interface QueryPagination<K, T> {
  pageList(query: K): Promise<Pagination<Partial<T>[]>>;
}
