export interface PageInfoNumber<T> {
  pageNumber: number;
  pageSize: number;
  data: T;
  total: number;
}
