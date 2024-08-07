import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getTotalByCategory } from "@/api/services/seating.services";
import { ITotalByCategory } from "@/interfaces/totals.interfaces";
import { useAllCategories } from "@/hooks/category/category.query";
import { months } from "@/lib/months";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());

const FilterTotalByCategory = () => {
  const { data: categories } = useAllCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("5");
  const [result, setResult] = useState<ITotalByCategory | null>(null);

  const handleFilter = async () => {
    try {
      const result = await getTotalByCategory(
        selectedCategory,
        parseInt(selectedYear),
        parseInt(selectedMonth)
      );
      setResult(result);
    } catch (error: any) {
      setResult(null);
    }
  };

  return (
    <Dialog>
      <DialogTrigger
        asChild
        className="font-bold py-1 px-4 mr-2 rounded-l bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-gray-900"
      >
        <Button>Filtros</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-[#040303] text-zinc-300 border-2 border-slate-800">
        <DialogHeader>
          <DialogTitle className="text-center font-bold">
            Filtrar por código, mes y año
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label>
              Código
              <Select
                value={selectedCategory}
                onValueChange={(value: any) => setSelectedCategory(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona una categoría" />
                </SelectTrigger>
                <SelectContent>
                  {categories?.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <div className="flex space-x-4">
            <div className="flex-1">
              <label>
                Mes
                <Select
                  value={selectedMonth}
                  onValueChange={(value: any) => setSelectedMonth(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un mes" />
                  </SelectTrigger>
                  <SelectContent>
                    {months.map((month) => (
                      <SelectItem key={month.id} value={month.id.toString()}>
                        {month.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>

            <div className="flex-1">
              <label>
                Año
                <Select
                  value={selectedYear}
                  onValueChange={(value: any) => setSelectedYear(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un año" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handleFilter}
          className="text-white mb-2 bg-[#1F316F] border-0 py-1 px-6 focus:outline-none hover:bg-[#2E4A9E] rounded text-lg transition-colors duration-300 ease-in-out font-bold"
        >
          Filtrar
        </button>

        {result && (
          <div className="mb-4 p-4 bg-[#021526] rounded-lg text-white">
            <div className="mb-2">
              <span className="font-semibold">Crédito:</span>{" "}
              {result._sum.credit}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Débito:</span> {result._sum.debit}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Suma de ambos:</span>{" "}
              {result.total}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default FilterTotalByCategory;
