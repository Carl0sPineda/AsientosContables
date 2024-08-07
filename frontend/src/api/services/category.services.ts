import { AxiosError } from "axios";
import { axiosInstance } from "../config/axiosInstance.";
import { ICategory, IFormCategory } from "../../interfaces/category.interfaces";
import { toast } from "sonner";

export const getAllcategories = async (): Promise<ICategory[]> => {
  try {
    const { data } = await axiosInstance.get<ICategory[]>("/category");
    console.log(data);

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      throw new Error(error.response?.data);
    }

    console.log(error);
    throw new Error("Error al obtener categorias");
  }
};

export const addCategory = async (
  category: IFormCategory
): Promise<IFormCategory> => {
  try {
    const { data } = await axiosInstance.post<IFormCategory>(
      "/category",
      category
    );
    console.log(data);

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      if (error.response?.data.status === 409) {
        toast.error("La categoria ya esta en uso");
      }
      console.log(error.response?.data);
      throw new Error(error.response?.data);
    }
    console.log(error);
    throw new Error("Error al añadir categoria");
  }
};
