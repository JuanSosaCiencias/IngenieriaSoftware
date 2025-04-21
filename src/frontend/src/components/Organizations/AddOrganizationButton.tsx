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

import { usePopUp } from "../../contexts/PopUpContext";
import RegisterOrganizationForm from "./RegisterOrganization";
import { Organization } from "../../models/organization";
import { useAuth } from "../../contexts/AuthContext";
import { PlusIcon } from "@heroicons/react/outline";

interface AddOrganizationButtonProps {
  onUpdate: (newOrg: Organization) => void;
}

const AddOrganizationButton: React.FC<AddOrganizationButtonProps> = ({ onUpdate }) => {
  const popUpContext = usePopUp();
  const { isAuthenticated } = useAuth();

  function openPopUp() {
    popUpContext?.setContent(<RegisterOrganizationForm onUpdate={onUpdate} />);
    popUpContext?.setOpen(true);
  }

  return (
    <div className="flex justify-center mt-8 mb-12">
      <button
        onClick={openPopUp}
        disabled={!isAuthenticated}
        className={`
          flex items-center justify-center
          px-6 py-3 rounded-full font-medium shadow-md
          text-white
          ${isAuthenticated
            ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
            : 'bg-gray-400 cursor-not-allowed'}
          transition duration-200 transform hover:-translate-y-1
          focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        `}
      >
        <PlusIcon className="h-5 w-5 mr-2" />
        Crear Organización
      </button>
    </div>
  );
};

export default AddOrganizationButton;
