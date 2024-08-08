import { ISeating } from "./seating.interfces";

export interface ITotalByCategory {
  _sum: ISum;
  total: number;
  seatings: ISeating[];
}

export interface ISum {
  debit: number;
  credit: number;
}
