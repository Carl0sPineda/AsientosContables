import { ICategory, IFormCategory } from "@/interfaces/category.interfaces";
import {
  AddCategory,
  ListCategories,
  EditCategory,
  DeleteCategory,
} from "../../wailsjs/go/main/App";

export const addCategory = async (category: IFormCategory): Promise<void> => {
  try {
    return await AddCategory(category.Name);
  } catch (error) {
    throw new Error("Failed to add category");
  }
};

export const allCategories = async (): Promise<ICategory[]> => {
  try {
    return await ListCategories();
  } catch (error) {
    throw new Error("Failed to get categories");
  }
};

export const editCategory = async (category: ICategory): Promise<void> => {
  try {
    return await EditCategory(category.ID, category.Name);
  } catch (error) {
    throw new Error("Failed to edit category");
  }
};

export const deleteCategory = async (id: number): Promise<void> => {
  try {
    return await DeleteCategory(id);
  } catch (error) {
    throw new Error("Failed to delete category");
  }
};
