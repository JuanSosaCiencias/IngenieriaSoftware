/*
Nombre del programa: Impulsa tu futuro
Copyright (C) 2025 - Autores:
Merino Peña Kevin Ariel
Ortíz Montiel Diego Iain
Rodríguez Dimayuga Laura Itzel
Sosa Romo Juan Mario
Vargas Campos Miguel Angel

Este programa es software libre: puede redistribuirlo y/o modificarlo
bajo los términos de la Licencia Pública General de GNU v3 publicada por
la Free Software Foundation.

Este programa se distribuye con la esperanza de que sea útil,
pero SIN NINGUNA GARANTÍA; sin incluso la garantía implícita de
COMERCIABILIDAD o IDONEIDAD PARA UN PROPÓSITO PARTICULAR.
Consulte la Licencia Pública General de GNU para más detalles.

Debería haber recibido una copia de la Licencia Pública General de GNU
junto con este programa. Si no, consulte <https://www.gnu.org/licenses/>.
*/

import { useEffect, useState } from "react";
import OpportunityCard from "./OpportunityCard";
import { OpportunityContent } from "../../types/opportunity";
import OpportunityDetails from "./OpportunityDetails";
import { usePopUp } from "../../contexts/PopUpContext";
import { useGrid } from "../../contexts/GridContext";
import { parseOpportunity } from "../../types/opportunity";

const ITEMS_PER_PAGE = 8;

const Opportunities: React.FC = () => {
  const cardsContext = useGrid();
  const popUpContext = usePopUp();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  function openPopUp(opportunity: OpportunityContent) {
    popUpContext?.setContent(<OpportunityDetails item={opportunity} />);
    popUpContext?.setOpen(true);
  }

  useEffect(() => {
    setLoading(true);
    const url = "http://localhost:8000/scholarships/";
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("No se pudieron cargar las oportunidades");
        }
        return response.json();
      })
      .then((items) => {
        const opportunities = items.map((item: any) => parseOpportunity(item));
        cardsContext?.setElems(opportunities);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching opportunities:", error);
        setError("No se pudieron cargar las oportunidades. Inténtalo de nuevo más tarde.");
        setLoading(false);
      });
  }, []);

  const totalItems = cardsContext?.elems.length ?? 0;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  const paginatedItems = (cardsContext?.elems ?? []).slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Explora Oportunidades
      </h1>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded-lg mb-6">
          <p>{error}</p>
        </div>
      )}

      {/* Empty */}
      {!loading && !error && totalItems === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-2">
            No se encontraron oportunidades
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Vuelve más tarde o crea una nueva oportunidad.
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && paginatedItems.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 auto-rows-fr mb-6">
            {paginatedItems.map((opportunity, index) => (
              <div onClick={() => openPopUp(opportunity)} key={opportunity.id || index}>
                <OpportunityCard item={opportunity} />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
            <span>
              Mostrando {Math.min((currentPage - 1) * ITEMS_PER_PAGE + 1, totalItems)}–
              {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} de {totalItems}
            </span>
            <div className="space-x-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded ${
                  currentPage === 1
                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                }`}
              >
                Anterior
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded ${
                  currentPage === totalPages
                    ? "bg-gray-300 dark:bg-gray-700 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800 text-white"
                }`}
              >
                Siguiente
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Opportunities;
