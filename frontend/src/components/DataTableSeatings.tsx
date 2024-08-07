import { useAllSeatings } from "@/hooks/seating/seating.queries";
import { DateFormat } from "@/lib/dateFormat";
import { useState } from "react";

const DataTableSeatings = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { data: seatingsData } = useAllSeatings(pageNumber);

  const goToNextPage = () => {
    setPageNumber((prevPageNumber) => prevPageNumber + 1);
  };

  const goToPreviousPage = () => {
    if (pageNumber > 1) {
      setPageNumber((prevPageNumber) => prevPageNumber - 1);
    }
  };

  return (
    <div className="w-full mx-auto overflow-auto">
      <div className="flex justify-end mb-2">
        <button
          className="font-bold py-1 px-4 mr-2 rounded-l bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-gray-900
"
        >
          Filtros
        </button>
        <button
          onClick={goToPreviousPage}
          disabled={pageNumber === 1}
          className={`${
            pageNumber === 1
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-gray-900"
          } font-bold py-1 px-4 mr-2 rounded-l`}
        >
          Anterior
        </button>
        <span className="py-1 px-4 bg-gray-200">
          {pageNumber}/{seatingsData?.totalPages}
        </span>
        <button
          onClick={goToNextPage}
          disabled={pageNumber === seatingsData?.totalPages}
          className={`${
            pageNumber === seatingsData?.totalPages
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-gray-200 hover:bg-gray-300 text-gray-800 hover:text-gray-900"
          } font-bold py-1 px-4 ml-2 rounded-r`}
        >
          Siguiente
        </button>
      </div>
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
            <th className="px-4 py-3 title-font tracking-wider font-medium text-gray-900 text-sm bg-gray-100 rounded-tr rounded-br">
              ACCIONES
            </th>
          </tr>
        </thead>
        <tbody>
          {seatingsData && seatingsData?.seatings?.length > 0 ? (
            seatingsData?.seatings.map((seating) => (
              <tr key={seating.id}>
                <td className="px-4 py-3">{seating.category.name}</td>
                <td className="px-4 py-3">{seating.description}</td>
                <td className="px-4 py-3">{seating.credit}</td>
                <td className="px-4 py-3">{seating.debit}</td>
                <td className="px-4 py-3">{seating.detail}</td>
                <td className="px-4 py-3">{DateFormat(seating.date)}</td>
                <td className="px-4 py-3">{seating.numDoc}</td>
                <td className="px-4 py-3">{seating.asn}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={9} className="px-4 py-3 text-center text-gray-500">
                No hay datos disponibles.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTableSeatings;
