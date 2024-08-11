import { useAddCategory } from "@/hooks/category/category.muation";
import { useForm } from "react-hook-form";
import { IFormCategory } from "../interfaces/category.interfaces";
import { toast } from "sonner";
import { schemaAddCategory } from "@/interfaces/category.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

const FormCategory = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormCategory>({
    resolver: zodResolver(schemaAddCategory),
  });
  const addCategoryMutation = useAddCategory();

  const onSubmit = async (data: IFormCategory) => {
    try {
      await addCategoryMutation.mutateAsync(data);
      reset();
      toast.success("Datos agregados correctamente!");
    } catch (error) {
      toast.error("Este código ya existe, agrega otro!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center space-x-2 my-1"
    >
      <div className="relative flex-1">
        <input
          className={cn(
            "w-full bg-gray-800 rounded border border-gray-700 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900 text-base outline-none text-gray-100 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out",
            { "border-red-400": errors.name }
          )}
          type="text"
          {...register("name")}
          placeholder="Introduce un código"
          autoComplete="off"
        />
        {errors.name && (
          <span className="text-red-400 text-sm absolute left-0 bottom-[-1.5rem] w-full">
            {errors.name.message}
          </span>
        )}
      </div>

      <button className="bg-[#134B70] px-4 py-2 text-gray-200 rounded whitespace-nowrap transition-colors duration-300 ease-in-out hover:bg-[#0F3A57]">
        Añadir código
      </button>
    </form>
  );
};

export default FormCategory;
