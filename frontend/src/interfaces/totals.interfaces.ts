export interface TotalByCategory {
  _sum: Sum;
  total: number;
}

export interface Sum {
  debit: number;
  credit: number;
}
