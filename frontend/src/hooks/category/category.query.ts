import { getAllcategories } from "@/api/services/category.services";
import { useQuery } from "@tanstack/react-query";

const useAllCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: getAllcategories,
  });
};

export { useAllCategories };
