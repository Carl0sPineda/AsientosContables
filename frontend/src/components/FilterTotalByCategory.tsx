import { useState } from "react";
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
import { currencyFormatter } from "@/lib/currencyFormater";
import { DateFormat } from "@/lib/dateFormat";
import { useLocation } from "react-router-dom";

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
    <>
      <div className="max-w-md mx-auto p-4 space-y-4">
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Código
            <Select
              value={selectedCategory}
              onValueChange={(value: any) => setSelectedCategory(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un código" />
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
            <label className="block text-gray-700 font-semibold mb-2">
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
            <label className="block text-gray-700 font-semibold mb-2">
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

        <button
          onClick={handleFilter}
          className="w-full bg-[#1F316F] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#2E4A9E] transition-colors duration-300 ease-in-out font-bold"
        >
          Filtrar
        </button>
      </div>

      <div className="mb-4 p-4">
        {result && (
          <div className="flex space-x-4">
            <div className="flex items-center">
              <span className="font-semibold mr-2">Crédito:</span>
              <span>{currencyFormatter(result._sum.credit)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Débito:</span>
              <span>{currencyFormatter(result._sum.debit)}</span>
            </div>
            <div className="flex items-center">
              <span className="font-semibold mr-2">Total de ambos:</span>
              <span>{currencyFormatter(result.total)}</span>
            </div>
          </div>
        )}
        <table className="table-auto w-full text-left whitespace-no-wrap">
          <thead>
            <tr>
              <th className="px-4 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tl rounded-bl">
                CÓDIGO./CTA
              </th>
              <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                DESCRIPCIÓN
              </th>
              <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                CRÉDITO
              </th>
              <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                DÉBITO
              </th>
              <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                DETALLE./ASIENTO
              </th>
              <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                FECHA
              </th>
              <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                NUM./DOC
              </th>
              <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100">
                ASN
              </th>
            </tr>
          </thead>
          <tbody>
            {result?.seatings.length ? (
              result.seatings.map((seating) => (
                <tr
                  key={seating.id}
                  className="hover:bg-zinc-100 transition-colors duration-300 ease-in-out"
                >
                  <td className="border-b-2 border-gray-200 px-4 py-3 text-sm">
                    {seating.category.name}
                  </td>
                  <td className="border-b-2 border-gray-200 px-4 py-3 text-sm">
                    {seating.description}
                  </td>
                  <td className="border-b-2 border-gray-200 px-4 py-3 text-sm">
                    {currencyFormatter(seating.credit)}
                  </td>
                  <td className="border-b-2 border-gray-200 px-4 py-3 text-sm">
                    {currencyFormatter(seating.debit)}
                  </td>
                  <td className="border-b-2 border-gray-200 px-4 py-3 text-sm">
                    {seating.detail}
                  </td>
                  <td className="border-b-2 border-gray-200 px-4 py-3 text-sm">
                    {DateFormat(seating.date)}
                  </td>
                  <td className="border-b-2 border-gray-200 px-4 py-3 text-sm">
                    {seating.numDoc}
                  </td>
                  <td className="border-b-2 border-gray-200 px-4 py-3 text-sm">
                    {seating.asn}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="p-4 text-center text-gray-500">
                  No hay datos disponibles.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default FilterTotalByCategory;
