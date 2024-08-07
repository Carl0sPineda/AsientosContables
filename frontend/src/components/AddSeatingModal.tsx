import { useAddCategory } from "@/hooks/category/category.muation";
import { useAllCategories } from "@/hooks/category/category.query";
import { useForm } from "react-hook-form";
import { IFormCategory } from "../interfaces/category.interfaces";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const AddSeatingModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  // const { data: categories } = useAllCategories();
  // const { register, handleSubmit, reset } = useForm<IFormCategory>();
  // const addCategoryMutation = useAddCategory();

  // const onSubmit = async (data: IFormCategory) => {
  //   try {
  //     await addCategoryMutation.mutateAsync(data);
  //     reset();
  //   } catch (error) {
  //     console.error("Error adding category:", error);
  //   }
  // };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        className="transition-background inline-flex h-12 items-center justify-center rounded-md border border-zinc-400 bg-gradient-to-r from-gray-100 via-[#c7d2fe] to-[#8678f9] bg-[length:200%_200%] bg-[0%_0%] px-6 font-medium text-gray-950 duration-500 hover:bg-[100%_200%] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
      >
        <Button className="mt-4">Añadir asiento</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#040303] text-zinc-300 border-2 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-center font-bold">
            Añadir asiento
          </DialogTitle>
        </DialogHeader>
        {/* <form
        className="flex flex-col items-center mt-4"
        onSubmit={handleSubmit(onSubmit)}
      >
        <input
          type="text"
          {...register("name")}
          placeholder="Name"
          autoComplete="off"
        />

        <button className="bg-slate-500 px-1 mt-2 ml-2 text-gray-200">
          Add User
        </button>
      </form> */}
      </DialogContent>
    </Dialog>
  );
};

export default AddSeatingModal;
