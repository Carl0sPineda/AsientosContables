import { deleteSeating } from "@/api/services/seating.services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// const useAddSeating = () => {
//   const queryClient = useQueryClient();
//   return useMutation({
//     mutationFn: addSeating,
//     onSuccess() {
//       queryClient.invalidateQueries({ queryKey: ["seatings"] });
//     },
//   });
// };

const useDeleteSeating = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteSeating,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["seatings"] });
    },
  });
};

export { useDeleteSeating };
