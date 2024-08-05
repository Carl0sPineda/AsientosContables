import { IFormSeating, ISeating } from "@/interfaces/seating.interfces";
import {
  AddSeating,
  ListSeatings,
  EditSeating,
  DeleteSeating,
} from "../../wailsjs/go/main/App";

export const addSeating = async (seating: IFormSeating): Promise<void> => {
  try {
    return await AddSeating(
      seating.Description,
      seating.Debit,
      seating.Credit,
      seating.Detail,
      seating.Date,
      seating.NumDoc,
      seating.ASN,
      seating.CategoryID
    );
  } catch (error) {
    throw new Error("Failed to add seating");
  }
};

export const allSeatings = async (): Promise<ISeating[]> => {
  try {
    return await ListSeatings();
  } catch (error) {
    throw new Error("Failed to get seatings");
  }
};

export const editSeating = async (seating: ISeating): Promise<void> => {
  try {
    return await EditSeating(
      seating.ID,
      seating.Description,
      seating.Debit,
      seating.Credit,
      seating.Detail,
      seating.Date,
      seating.NumDoc,
      seating.ASN,
      seating.CategoryID
    );
  } catch (error) {
    throw new Error("Failed to edit seating");
  }
};

export const deleteSeating = async (id: number): Promise<void> => {
  try {
    return await DeleteSeating(id);
  } catch (error) {
    throw new Error("Failed to delete seating");
  }
};
