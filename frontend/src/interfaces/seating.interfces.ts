export interface IFormSeating {
  Description: string;
  Debit: number;
  Credit: number;
  Detail: string;
  Date: string;
  NumDoc: string;
  ASN: string;
  CategoryID: number;
  Category: string;
}

export interface ISeating extends IFormSeating {
  ID: number;
}
