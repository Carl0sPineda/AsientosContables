import { ICategory } from "./category.interfaces";

export interface IFormSeating {
  description: string;
  debit?: string;
  credit?: string;
  detail: string;
  date: string;
  numDoc: string;
  asn: string;
  categoryId: number;
}

export interface IUpdateSeating extends IFormSeating {
  id: string;
}

export interface ISeating extends IFormSeating {
  id: string;
  category: ICategory;
}

export interface ISeatings {
  totalPages: number;
  seatings: ISeating[];
}
