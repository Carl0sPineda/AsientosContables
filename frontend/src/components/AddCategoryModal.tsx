import { useAddCategory } from "@/hooks/category/category.muation";
import { useAllCategories } from "@/hooks/category/category.query";
import { useForm } from "react-hook-form";
import { IFormCategory } from "../interfaces/category.interfaces";

const AddCategoryModal = () => {
  const { data: categories } = useAllCategories();
  const { register, handleSubmit, reset } = useForm<IFormCategory>();
  const addCategoryMutation = useAddCategory();

  const onSubmit = async (data: IFormCategory) => {
    try {
      await addCategoryMutation.mutateAsync(data);
      reset();
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  return (
    <div>
      <form
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
      </form>

      {categories?.map((category) => (
        <ul key={category.id} className="mt-4 flex justify-center">
          <li>
            ID {category.id} - NAME {category.name}
          </li>
        </ul>
      ))}
    </div>
  );
};

export default AddCategoryModal;
