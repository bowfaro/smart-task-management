export class Pagination {
  currentPage: number = 1;
  perPage: number = 10;
}

export class PaginationResponse<T> {
  items: T[];
  total: number;

  constructor(items: T[], total: number) {
    this.items = items;
    this.total = total;
  }
}
