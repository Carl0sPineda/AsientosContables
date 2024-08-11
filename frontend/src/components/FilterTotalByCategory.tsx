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
import { DownloadIcon } from "@radix-ui/react-icons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import dayjs from "dayjs";

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

  const truncateText = (text: string, maxLength: number): string => {
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };

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

  const handleGeneratePDF = () => {
    if (!result || result.seatings.length === 0) return;

    const doc = new jsPDF();
    const margin = 20;
    const rowHeight = 10;
    const headerHeight = 10;

    const firstSeatingDate = result.seatings[0].date;
    const monthYear = dayjs(firstSeatingDate).format("MMMM YYYY");

    doc.setFontSize(15);
    const title = `Resumen de asiento - ${monthYear}`;
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleX = (pageWidth - titleWidth) / 2;

    doc.text(title, titleX, margin);

    const tableColumn = [
      "Código/CTA",
      "Descripción",
      "Crédito",
      "Débito",
      "Detalle/Asiento",
      "Fecha",
      "Num./Doc",
      "ASN",
    ];

    const tableRows = result.seatings.map((seating) => [
      seating.category.name,
      truncateText(seating.description, 32),
      seating.credit === "0"
        ? ""
        : currencyFormatter(seating.credit).replace("₡", ""),
      seating.debit === "0"
        ? ""
        : currencyFormatter(seating.debit).replace("₡", ""),
      truncateText(seating.detail, 32),
      DateFormat(seating.date),
      seating.numDoc,
      seating.asn,
    ]);

    let finalY = 0;

    autoTable(doc, {
      startY: margin + 10,
      head: [tableColumn],
      body: tableRows,
      styles: {
        fontSize: 7,
        cellPadding: 1,
        overflow: "linebreak",
      },
      margin: { left: 10, right: 10 },
      theme: "striped",
      didDrawPage: function (data) {
        if (data.cursor && data.cursor.y !== undefined) {
          finalY = data.cursor.y; // Guarda la posición Y final de la tabla
        } else {
          finalY = margin; // Si no existe 'data.cursor', usa el margen inicial
        }
      },
    });

    // Añadir margen superior de 8 unidades
    finalY += 8;

    doc.setFontSize(8);
    doc.setLineWidth(0.2);

    const subtotalCreditText = `Subtotal Crédito: ${currencyFormatter(
      result._sum.credit
    ).replace("₡", "")}`;
    const subtotalDebitText = `Subtotal Débito: ${currencyFormatter(
      result._sum.debit
    ).replace("₡", "")}`;
    const totalBothText = `Balance Total: ${currencyFormatter(
      result.total
    ).replace("₡", "")}`;

    const textWidths = [
      doc.getTextWidth(subtotalCreditText),
      doc.getTextWidth(subtotalDebitText),
      doc.getTextWidth(totalBothText),
    ];

    const totalTextWidth = textWidths.reduce((a, b) => a + b, 0);
    const spaceBetweenTexts = 10;
    const availableWidth = pageWidth - 2 * margin;
    const startingX =
      (availableWidth - totalTextWidth - 2 * spaceBetweenTexts) / 2 + margin;

    let currentX = startingX;

    // Asegúrate de que los totales estén en la última página y justo después de la tabla
    if (finalY + rowHeight > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      finalY = margin + 8; // Añadir el margen superior en la nueva página
    }

    // Dibuja los totales en la última página
    doc.line(margin, finalY - 2, pageWidth - margin, finalY - 2);

    doc.text(subtotalCreditText, currentX, finalY + 2);
    currentX += textWidths[0] + spaceBetweenTexts;
    doc.text(subtotalDebitText, currentX, finalY + 2);
    currentX += textWidths[1] + spaceBetweenTexts;
    doc.text(totalBothText, currentX, finalY + 2);

    doc.save(`resumen_asiento_${monthYear}.pdf`);
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
          <div className="flex justify-between items-center space-x-4">
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
            <button
              onClick={handleGeneratePDF}
              className="bg-[#C80036] text-white py-2 px-4 rounded-lg shadow-md hover:bg-[#f60842] transition-colors duration-300 ease-in-out font-bold flex items-center"
            >
              Generar PDF
              <DownloadIcon className="ml-2 font-bold" />
            </button>
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
                    {truncateText(seating.description, 25)}
                  </td>
                  <td className="border-b-2 border-gray-200 px-4 py-3 text-sm">
                    {seating.credit === "0"
                      ? ""
                      : currencyFormatter(seating.credit)}
                  </td>
                  <td className="border-b-2 border-gray-200 px-4 py-3 text-sm">
                    {seating.debit === "0"
                      ? ""
                      : currencyFormatter(seating.debit)}
                  </td>
                  <td className="border-b-2 border-gray-200 px-4 py-3 text-sm">
                    {truncateText(seating.detail, 25)}
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
