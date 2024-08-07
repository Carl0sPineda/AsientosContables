import { useAllSeatings } from "@/hooks/seating/seating.queries";
import { DateFormat } from "@/lib/dateFormat";
import { useState } from "react";
import FilterTotalByCategory from "./FilterTotalByCategory";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";
import { useDeleteSeating } from "@/hooks/seating/seating.mutations";
import { toast } from "sonner";
import { currencyFormatter } from "@/lib/currencyFormater";

const DataTableSeatings = () => {
  const [pageNumber, setPageNumber] = useState<number>(1);
  const { data: seatingsData } = useAllSeatings(pageNumber);
  const deleteSeatingMutation = useDeleteSeating();

  const handleDelete = async (id: string) => {
    try {
      await deleteSeatingMutation.mutateAsync(id);
      toast.success("Datos eliminados correctamente!");
    } catch (error) {
      toast.error("Ha ocurrido un error!");
    }
  };

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
        <FilterTotalByCategory />
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
                <td className="border-b-2 border-gray-200 px-4 py-3">
                  {seating.category.name}
                </td>
                <td className="border-b-2 border-gray-200 px-4 py-3">
                  {seating.description}
                </td>
                <td className="border-b-2 border-gray-200 px-4 py-3">
                  {currencyFormatter(seating.credit)}
                </td>
                <td className="border-b-2 border-gray-200 px-4 py-3">
                  {currencyFormatter(seating.debit)}
                </td>
                <td className="border-b-2 border-gray-200 px-4 py-3">
                  {seating.detail}
                </td>
                <td className="border-b-2 border-gray-200 px-4 py-3">
                  {DateFormat(seating.date)}
                </td>
                <td className="border-b-2 border-gray-200 px-4 py-3">
                  {seating.numDoc}
                </td>
                <td className="border-b-2 border-gray-200 px-4 py-3">
                  {seating.asn}
                </td>
                <td className="border-b-2 border-gray-200 px-4 py-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild className="ml-2">
                      <Button
                        aria-label="Acciones"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <DotsHorizontalIcon />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>
                        Acciones para {seating.category.name}
                      </DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuGroup>
                        {/* <EditAccountModal accountId={account} /> */}

                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger>
                            Eliminar fila
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent>
                              <DropdownMenuLabel>
                                Estás seguro de eliminar?
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="focus:bg-gray-800 focus:text-white">
                                No, cancelar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDelete(seating.id)}
                                className="focus:bg-red-800 focus:text-white"
                              >
                                Si, continuar
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                      </DropdownMenuGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
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
