export interface PageInfoNumber<T> {
  pageNumber: number;
  pageSize: number;
  data: T;
  total: number;
}

export interface Pagination<T> {
  pageNumber: string;
  pageSize: string;
  data: T;
  total: number;
}
