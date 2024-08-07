import {
  getTotalByCategory,
  getAllseatings,
} from "@/api/services/seating.services";
import { useQuery } from "@tanstack/react-query";

const useTotalByCategory = (
  id_category: string,
  year: number,
  month: number
) => {
  return useQuery({
    queryKey: ["totals", id_category, year, month],
    queryFn: () => getTotalByCategory(id_category, year, month),
  });
};

const useAllSeatings = (page: number) => {
  return useQuery({
    queryKey: ["seatings", page],
    queryFn: () => getAllseatings(page),
  });
};

export { useTotalByCategory, useAllSeatings };
