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

import { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { usePopUp } from '../../contexts/PopUpContext';
import { useAuth } from '../../contexts/AuthContext';
import apiInstance from '../../services/axiosInstance';
import { Organization } from '../../models/organization';
import { DocumentTextIcon, MailIcon, GlobeAltIcon, PhotographIcon } from '@heroicons/react/outline';

export interface RegisterOrganizationFormProps {
  onUpdate: (org: Organization) => void;
}

export function RegisterOrganizationForm({ onUpdate }: RegisterOrganizationFormProps) {
  const authContext = useAuth();
  const popUpContext = usePopUp();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch
  } = useForm<any>({
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      website: '',
      description: '',
      image: undefined
    }
  });

  const watchImageField = watch("image");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    if (watchImageField && watchImageField.length > 0) {
      const file = watchImageField[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews([reader.result as string]);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreviews([]);
    }
  }, [watchImageField]);

  const handleRegisterOrganization = async (data: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = authContext.authToken;
      if (!token) {
        setError('No se ha iniciado sesión');
        return;
      }

      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('email', data.email);
      formData.append('website', data.website);
      formData.append('description', data.description || '');
      
      // Solo añadir la imagen si existe
      if (data.image && data.image.length > 0) {
        formData.append('image', data.image[0]);
      }

      const response = await apiInstance.post("api/organizations/", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      onUpdate(response.data);
      setSuccess(true);
      
      // Cerrar el modal después de un breve retraso
      setTimeout(() => {
        popUpContext.setOpen(false);
      }, 1500);
      
    } catch (error) {
      console.error("Error al registrar la organización:", error);
      setError("Error al registrar la organización. Por favor, inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const submitHandler: SubmitHandler<any> = async (data) => {
    await handleRegisterOrganization(data);
  };

  if (loading && !success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-96">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600 dark:border-blue-400 mb-4"></div>
        <p className="text-gray-700 dark:text-gray-300 text-center">Cargando...</p>
      </div>
    );
  }
  
  if (success) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-96">
        <div className="bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full p-4 mb-4">
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">¡Organización registrada!</h3>
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Tu organización ha sido registrada exitosamente.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(submitHandler)}
      className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6"
    >
      <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">Registrar Organización</h2>
      </div>

      {error && (
        <div className="bg-red-100 dark:bg-red-900 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-4 rounded">
          <p>{error}</p>
        </div>
      )}

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
                value: /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+\.[a-z]+(\/[a-zA-Z0-9#]+\/?)*$/,
                message: 'Ingresa una URL válida'
              }
            })}
            placeholder="https://www.miempresa.com"
            className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
          />
        </div>
        {errors.website && <span className="text-red-500 text-sm block mt-1">{errors.website.message}</span>}
      </div>

      {/* Imagen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Logo o Imagen Representativa
        </label>
        <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors">
          <div className="space-y-1 text-center">
            {imagePreviews.length > 0 ? (
              <div className="flex flex-col items-center">
                <img
                  src={imagePreviews[0]}
                  alt="Preview"
                  className="h-40 object-cover rounded-lg shadow-md mb-3"
                />
                <button
                  type="button"
                  onClick={() => {
                    setValue('image', undefined as any);
                    setImagePreviews([]);
                  }}
                  className="text-sm text-red-600 dark:text-red-400 hover:underline"
                >
                  Eliminar imagen
                </button>
              </div>
            ) : (
              <>
                <PhotographIcon className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                  <label className="relative cursor-pointer bg-white dark:bg-gray-700 rounded-md font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 focus-within:outline-none">
                    <span>Subir imagen</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      {...register('image')}
                    />
                  </label>
                  <p className="pl-1">o arrastrar y soltar</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  PNG, JPG, GIF hasta 10MB
                </p>
              </>
            )}
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
          disabled={!isValid || loading}
          className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-full shadow-sm text-white
            ${isValid && !loading ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800' : 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'}
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200`}
        >
          {loading ? 'Registrando...' : 'Registrar Organización'}
        </button>
      </div>
    </form>
  );
}

export default RegisterOrganizationForm;