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

import { useForm, SubmitHandler } from 'react-hook-form';
import { usePopUp } from '../../contexts/PopUpContext';
import { useAuth } from '../../contexts/AuthContext';
import apiInstance from '../../services/axiosInstance';
import { Organization } from '../../models/organization';
import { DocumentTextIcon, MailIcon, GlobeAltIcon } from '@heroicons/react/outline';

export interface RegisterOrganizationFormProps {
  onUpdate: (org: Organization) => void;
}

export function RegisterOrganizationForm({ onUpdate }: RegisterOrganizationFormProps) {
  const authContext = useAuth();
  const popUpContext = usePopUp();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      website: '',
      description: '',
    }
  });

  const handleRegisterOrganization = async (data: any) => {
    try {
      const token = authContext.authToken;
      if (!token) return;

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('website', data.website);
      formData.append('description', data.description || '');

      const response = await apiInstance.post("api/organizations/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onUpdate(response.data);
      popUpContext.setOpen(false);
    } catch (error) {
      console.error("Error al registrar la organización:", error);
    }
  };

  const submitHandler: SubmitHandler<any> = async (data) => {
    await handleRegisterOrganization(data);
  };

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6"
    >
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Registrar Organización</h2>
      </div>

      {/* Nombre */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Nombre de la Organización
        </label>
        <div className="relative">
          <DocumentTextIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            {...register('name', { required: 'El nombre de la organización es obligatorio.' })}
            placeholder="Nombre de la organización"
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        {errors.name && <span className="text-red-500 text-sm block mt-1">{errors.name.message}</span>}
      </div>

      {/* Correo */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Correo de Contacto
        </label>
        <div className="relative">
          <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="email"
            {...register('email', {
              required: 'El correo es obligatorio.',
              pattern: {
                value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                message: 'Ingresa un correo válido'
              }
            })}
            placeholder="contacto@empresa.com"
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        {errors.email && <span className="text-red-500 text-sm block mt-1">{errors.email.message}</span>}
      </div>

      {/* Sitio web */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Sitio Web
        </label>
        <div className="relative">
          <GlobeAltIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="url"
            {...register('website', {
              required: 'El sitio web es obligatorio.',
              pattern: {
                value: /^((https?|ftp|smtp):\/\/)?(www\.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
                message: 'Ingresa una URL válida'
              }
            })}
            placeholder="https://www.miempresa.com"
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        {errors.website && <span className="text-red-500 text-sm block mt-1">{errors.website.message}</span>}
      </div>

      {/* Imagen Genérica */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Logo o Imagen Representativa
        </label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg">
          <div className="flex flex-col items-center space-y-3">
            <img
              src=""
              alt=""
              className="h-40 object-cover rounded-lg shadow-md"
            />
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              Se usará un logo genérico por defecto. Puedes cambiarlo más adelante en el perfil de la organización.
            </p>
          </div>
        </div>
      </div>

      {/* Descripción */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Descripción (opcional)
        </label>
        <textarea
          {...register('description')}
          placeholder="Describe brevemente la organización"
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 resize-none"
        />
      </div>

      {/* Botón */}
      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={!isValid}
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white
            ${isValid ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
        >
          Registrar Organización
        </button>
      </div>
    </form>
  );
}

export default RegisterOrganizationForm;
