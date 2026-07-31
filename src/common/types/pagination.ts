export class Pagination {
  page: number;
  limit: number;
}

export class PaginationResponse<T> {
  items: T[];
  total: number;

  constructor(items: T[], total: number) {
    this.items = items;
    this.total = total;
  }
}
