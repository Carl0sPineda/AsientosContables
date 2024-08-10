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

  const handleGeneratePDF = () => {
    if (!result) return;

    const doc = new jsPDF();
    const margin = 20; // Margen general para los bordes
    const rowHeight = 10; // Altura de la fila de la tabla
    const headerHeight = 10; // Altura del encabezado de la tabla (puede ajustarse si es necesario)

    // Set the title
    doc.setFontSize(15);
    const title = "Resumen de Asientos por código";
    const titleWidth = doc.getTextWidth(title);
    const pageWidth = doc.internal.pageSize.getWidth();
    const titleX = (pageWidth - titleWidth) / 2;

    doc.text(title, titleX, margin); // Posición del título

    // Prepare table data
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
      seating.description,
      currencyFormatter(seating.credit).replace("₡", ""), // Remove '₡'
      currencyFormatter(seating.debit).replace("₡", ""), // Remove '₡'
      seating.detail,
      DateFormat(seating.date),
      seating.numDoc,
      seating.asn,
    ]);

    // Genera la tabla
    const startY = margin + 10; // Empieza la tabla justo debajo del título
    autoTable(doc, {
      startY: startY,
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
        // Calcula la altura total de la tabla
        const numRows = result.seatings.length;
        const tableHeight = numRows * rowHeight + headerHeight;

        // Posiciona los totales justo después de la tabla, sin espacio extra
        doc.setFontSize(8); // Tamaño de fuente más pequeño para los totales
        const totalsY = startY + tableHeight; // Posiciona los totales justo después de la tabla

        // Dibuja una línea justo encima del texto de los totales
        doc.setLineWidth(0.2); // Línea más delgada
        doc.line(
          margin,
          totalsY - 2, // Posiciona la línea muy cerca del texto de los totales
          pageWidth - margin,
          totalsY - 2
        );

        // Define los textos para los totales
        const subtotalCreditText = `Subtotal Crédito: ${currencyFormatter(
          result._sum.credit
        ).replace("₡", "")}`;
        const subtotalDebitText = `Subtotal Débito: ${currencyFormatter(
          result._sum.debit
        ).replace("₡", "")}`;
        const totalBothText = `Balance Total: ${currencyFormatter(
          result.total
        ).replace("₡", "")}`;

        // Calcula el ancho de cada texto
        const textWidths = [
          doc.getTextWidth(subtotalCreditText),
          doc.getTextWidth(subtotalDebitText),
          doc.getTextWidth(totalBothText),
        ];

        // Calcula el espacio total requerido para los textos
        const totalTextWidth = textWidths.reduce((a, b) => a + b, 0);
        const spaceBetweenTexts = 10; // Espacio entre los textos

        // Calcula el espacio disponible para los textos
        const availableWidth = pageWidth - 2 * margin;
        const startingX =
          (availableWidth - totalTextWidth - 2 * spaceBetweenTexts) / 2 +
          margin;

        // Posiciones X para los textos
        let currentX = startingX;

        // Dibuja los textos en una sola línea
        doc.text(subtotalCreditText, currentX, totalsY + 2); // Ajusta la posición Y para que esté justo al lado de la línea
        currentX += textWidths[0] + spaceBetweenTexts;
        doc.text(subtotalDebitText, currentX, totalsY + 2);
        currentX += textWidths[1] + spaceBetweenTexts;
        doc.text(totalBothText, currentX, totalsY + 2);
      },
    });

    // Guarda el PDF
    doc.save("resumen_asiento.pdf");
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
