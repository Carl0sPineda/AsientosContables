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
import { schemaAddSeating } from "@/interfaces/seating.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";

dayjs.extend(utc);
dayjs.extend(timezone);

const AddSeatingModal = () => {
  const [open, setOpen] = useState<boolean>(false);
  const { data: categories } = useAllCategories();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IFormSeating>({
    resolver: zodResolver(schemaAddSeating),
  });
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
            <label htmlFor="categoryId" className="block text-zinc-200">
              Código
            </label>
            <select
              id="categoryId"
              {...register("categoryId")}
              defaultValue=""
              className={cn(
                "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block w-full p-2.5",
                { "border-red-400": errors.categoryId }
              )}
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

            {errors.categoryId && (
              <span className="text-red-400 text-sm mt-1">
                {errors.categoryId.message}
              </span>
            )}
          </div>

          <div className="w-full mt-2">
            <label htmlFor="description" className="block text-zinc-200">
              Descripción
            </label>
            <textarea
              id="description"
              {...register("description")}
              placeholder="Ingrese una descripción"
              autoComplete="off"
              className={cn(
                "w-full bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600",
                { "border-red-400": errors.description }
              )}
            />
            {errors.description && (
              <span className="text-red-400 text-sm">
                {errors.description.message}
              </span>
            )}
          </div>

          <div className="w-full mt-2">
            <label htmlFor="detail" className="block text-zinc-200">
              Detalle
            </label>
            <input
              id="detail"
              type="text"
              {...register("detail")}
              placeholder="Ingrese el detalle"
              autoComplete="off"
              className={cn(
                "w-full bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600",
                { "border-red-400": errors.detail }
              )}
            />
            {errors.detail && (
              <span className="text-red-400 text-sm">
                {errors.detail.message}
              </span>
            )}
          </div>

          <div className="flex gap-2 w-full mt-2">
            <div className="w-1/2">
              <label htmlFor="debit" className="block text-zinc-200">
                Débito
              </label>
              <input
                id="debit"
                type="text"
                {...register("debit")}
                placeholder="Ingrese el débito"
                autoComplete="off"
                className={cn(
                  "w-full bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600",
                  { "border-red-400": errors.debit }
                )}
              />
              {errors.debit && (
                <span className="text-red-400 text-sm mt-1">
                  {errors.debit.message}
                </span>
              )}
            </div>

            <div className="w-1/2">
              <label htmlFor="credit" className="block text-zinc-200">
                Crédito
              </label>
              <input
                id="credit"
                type="text"
                {...register("credit")}
                placeholder="Ingrese el crédito"
                autoComplete="off"
                className={cn(
                  "w-full bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600",
                  { "border-red-400": errors.credit }
                )}
              />
              {errors.credit && (
                <span className="text-red-400 text-sm mt-1">
                  {errors.credit.message}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between gap-2 w-full mt-2">
            <div className="w-1/3">
              <label htmlFor="numDoc" className="block text-zinc-200">
                Num./Doc
              </label>
              <input
                id="numDoc"
                type="text"
                {...register("numDoc")}
                placeholder="Ingrese num.Doc"
                autoComplete="off"
                className={cn(
                  "w-full bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600",
                  { "border-red-400": errors.numDoc }
                )}
              />
              <span className="text-red-400 text-sm min-h-[1.25rem] block">
                {errors.numDoc?.message}
              </span>
            </div>

            <div className="w-1/3">
              <label htmlFor="date" className="block text-zinc-200">
                Fecha
              </label>
              <input
                id="date"
                type="date"
                {...register("date")}
                autoComplete="off"
                className={cn(
                  "w-full bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-950",
                  { "border-red-400": errors.date }
                )}
              />
              <span className="text-red-400 text-sm min-h-[1.25rem] block">
                {errors.date?.message}
              </span>
            </div>

            <div className="w-1/3">
              <label htmlFor="asn" className="block text-zinc-200">
                ASN
              </label>
              <input
                id="asn"
                type="text"
                {...register("asn")}
                placeholder="Ingrese el ASN"
                autoComplete="off"
                className={cn(
                  "w-full bg-gray-50 border border-gray-300 rounded text-gray-900 py-2 px-3 leading-8 focus:ring-green-500 focus:border-green-500 focus:ring-2 placeholder-gray-600",
                  { "border-red-400": errors.asn }
                )}
              />
              <span className="text-red-400 text-sm min-h-[1.25rem] block">
                {errors.asn?.message}
              </span>
            </div>
          </div>

          <button className="bg-[#285430] font-bold transition-colors duration-300 ease-in-out hover:bg-[#224529] w-full px-4 py-2 mt-4 text-gray-200 rounded">
            Guardar
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddSeatingModal;
