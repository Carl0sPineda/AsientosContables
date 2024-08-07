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

const currentYear = new Date().getFullYear();
const years = Array.from({ length: 6 }, (_, i) => (currentYear - i).toString());

const FilterTotalByCategory = () => {
  const { data: categories } = useAllCategories();
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>(
    currentYear.toString()
  );
  const [selectedMonth, setSelectedMonth] = useState<string>("1");
  const [result, setResult] = useState<ITotalByCategory | null>(null);

  const handleTest = async () => {
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
    <div>
      <h1>Prueba de getTotalByCategory</h1>

      <div>
        <label>
          Categoría:
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

      <div>
        <label>
          Mes:
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

      <div>
        <label>
          Año:
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

      <button onClick={handleTest}>Probar Método</button>

      {result && (
        <div>
          <h2>Resultado:</h2>
          <div>Credito: {result._sum.credit}</div>
          <div>Debito: {result._sum.debit}</div>
          <div>Total: {result.total}</div>
        </div>
      )}
    </div>
  );
};

export default FilterTotalByCategory;
