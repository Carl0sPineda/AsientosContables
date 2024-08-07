import { addCategory } from "@/api/services/category.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const useAddCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCategory,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["categories"] });
    },
  });
};

export { useAddCategory };
