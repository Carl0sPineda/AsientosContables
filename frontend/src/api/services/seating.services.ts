import { AxiosError } from "axios";
import { axiosInstance } from "../config/axiosInstance.";
import { ITotalByCategory } from "../../interfaces/totals.interfaces";
import { IFormSeating, ISeatings } from "@/interfaces/seating.interfces";

export const getTotalByCategory = async (
  id_category: string,
  year: number,
  month: number
): Promise<ITotalByCategory> => {
  try {
    const { data } = await axiosInstance.get<ITotalByCategory>(
      `/category-totals?categoryId=${id_category}&year=${year}&month=${month}`
    );
    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data);
    }
    throw new Error("Error al obtener monto total de categorias");
  }
};

export const getAllseatings = async (page: number): Promise<ISeatings> => {
  try {
    const { data } = await axiosInstance.get<ISeatings>(
      `/seating?_page=${page}`
    );

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data);
    }
    throw new Error("Error al obtener monto total de categorias");
  }
};

export const deleteSeating = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`seating/${id}`);
  } catch (error) {
    throw new Error("Failed to delete seating");
  }
};

export const addSeating = async (
  seating: IFormSeating
): Promise<IFormSeating> => {
  try {
    const { data } = await axiosInstance.post<IFormSeating>(
      "/seating",
      seating
    );
    console.log(data);

    return data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.log(error.response?.data);
      throw new Error(error.response?.data);
    }

    throw new Error("Error al añadir categoria");
  }
};
