import { useAllCategories } from "@/hooks/category/category.query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import FormCategory from "./FormCategory";
import { IFormSeating } from "../interfaces/seating.interfces";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAddSeating } from "@/hooks/seating/seating.mutations";
import { toast } from "sonner";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const AddSeatingModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: categories } = useAllCategories();
  const { register, handleSubmit, reset, setValue } = useForm<IFormSeating>();
  const addSeatingMutation = useAddSeating();

  const onSubmit = async (data: IFormSeating) => {
    try {
      // Convert date to ISO 8601 format with timezone
      const formattedData = {
        ...data,
        date: dayjs(data.date).tz(dayjs.tz.guess()).format(), // Convert date to ISO 8601 format with local timezone
      };

      await addSeatingMutation.mutateAsync(formattedData);
      reset();
      setOpen(false);
      toast.success("Datos agregados correctamente!");
    } catch (error) {
      toast.error("Ha ocurrido un error!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        asChild
        className="transition-background inline-flex h-12 items-center justify-center rounded-md border border-zinc-400 bg-gradient-to-r from-gray-100 via-[#c7d2fe] to-[#8678f9] bg-[length:200%_200%] bg-[0%_0%] px-6 font-medium text-gray-950 duration-500 hover:bg-[100%_200%] focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 focus:ring-offset-gray-50"
      >
        <Button className="mt-4">Añadir asiento</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] bg-[#040303] text-zinc-300 border-2 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-center font-bold">
            Añadir un asiento
          </DialogTitle>
        </DialogHeader>
        <FormCategory />
        <hr className="my-1 border-t-1 border-zinc-400" />

        <form
          className="flex flex-col items-center"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full">
            <select
              {...register("categoryId")}
              defaultValue=""
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg
          focus:ring-green-500 focus:border-green-500 block w-full p-2.5"
            >
              <option value="" disabled>
                Selecciona un código
              </option>
              {categories?.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <textarea
            {...register("description")}
            placeholder="Descripción"
            autoComplete="off"
            className="w-full bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 mt-2 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600"
          />
          <input
            type="text"
            {...register("detail")}
            placeholder="Detalle"
            autoComplete="off"
            className="w-full bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 mt-2 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600"
          />
          <div className="flex gap-2 w-full">
            <input
              type="number"
              {...register("debit")}
              placeholder="Débito"
              autoComplete="off"
              className="w-1/2 bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 mt-2 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600"
            />

            <input
              type="number"
              {...register("credit")}
              placeholder="Crédito"
              autoComplete="off"
              className="w-1/2 bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 mt-2 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600"
            />
          </div>
          <div className="flex items-center justify-between gap-2 w-full">
            <input
              type="text"
              {...register("numDoc")}
              placeholder="Ingrese num.Doc"
              autoComplete="off"
              className="w-1/3 bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 mt-2 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600"
            />

            <input
              type="date"
              {...register("date")}
              autoComplete="off"
              className="w-1/3 bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 mt-2 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-950"
            />

            <input
              type="text"
              {...register("asn")}
              placeholder="ASN"
              autoComplete="off"
              className="w-1/3 bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 mt-2 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600"
            />
          </div>
          <button className="bg-[#285430] w-full px-4 py-2 mt-4 text-gray-200 rounded">
            Guardar
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSeatingModal;
