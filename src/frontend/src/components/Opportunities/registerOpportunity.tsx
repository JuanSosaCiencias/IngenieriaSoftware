import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useGrid } from '../../contexts/GridContext';
import { usePopUp } from '../../contexts/PopUpContext';
import { useAuth } from '../../contexts/AuthContext';

const OpportunityTypes = [
    { value: 'beca', label: 'Beca' },
    { value: 'maestria', label: 'Maestría' },
    { value: 'doctorado', label: 'Doctorado' },
    { value: 'postdoc', label: 'Postdoc' },
    { value: 'investigacion', label: 'Investigación' },
    { value: 'intercambio', label: 'Intercambio' },
    { value: 'curso', label: 'Curso' },
    { value: 'taller', label: 'Taller' },
    { value: 'seminario', label: 'Seminario' },
    { value: 'conferencia', label: 'Conferencia' },
    { value: 'congreso', label: 'Congreso' },
    { value: 'simposio', label: 'Simposio' },
    { value: 'foro', label: 'Foro' },
    { value: 'voluntariado', label: 'Voluntariado' },
    { value: 'hackathon', label: 'Hackathon' },
    { value: 'evento', label: 'Evento' },
    { value: 'pasantia', label: 'Pasantía' },
    { value: 'otro', label: 'Otro' },
];

const countries = [
    { id: 1, name: 'Mexico' },
    { id: 2, name: 'Estado Unidos' },
    { id: 3, name: 'Canada' },
];

const interests = [
    { id: 1, name: 'Ciencia' },
    { id: 2, name: 'Tecnología' },
    { id: 3, name: 'Ingeniería' },
    { id: 4, name: 'Matemáticas' },
];

interface FormData {
    name: string;
    type: string[];
    start_date: string;
    end_date: string;
    image: FileList;
    content: string;
    interests: number[];
    created_by: number;
    country: number[];
}

const RegisterOpportunity: React.FC = () => {
    const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormData>({ mode: 'onChange' });
    
    const gridContext = useGrid();
    const popUpContext = usePopUp();
    const authContext = useAuth();

    const submitHandler: SubmitHandler<FormData> = async (data) => {
        console.log('Form submitted:', data); // Debugging log
        try {
            const token = authContext.authToken; // Retrieve the JWT token
            const username = authContext.user?.username; // Retrieve the username from authContext
            if (!token || !username) {
                throw new Error('User is not authenticated');
            }

            const formData = new FormData();
            formData.append('name', data.name); // Add the name field
            formData.append('start_date', data.start_date); // Start date
            formData.append('end_date', data.end_date); // End date
            formData.append('content', data.content); // Description
            formData.append('created_by', username); // Send the username as the creator
            // formData.append('type', data.type.join(',')); // Convert array to comma-separated string
            // formData.append('interests', data.interests.join(',')); // Convert array to comma-separated string
            // formData.append('country', data.country.join(',')); // Convert array to comma-separated string
            if (data.image && data.image.length > 0) {
                formData.append('image', data.image[0]); // Image file
            }

            console.log('FormData being sent:');
            for (const [key, value] of formData.entries()) {
                console.log(`${key}:`, value);
            }

            const response = await fetch('http://localhost:8000/scholarships/create/', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`, // Include the JWT token in the Authorization header
                },
                body: formData,
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Backend validation errors:', errorData);
                throw new Error('Failed to create opportunity');
            }

            const result = await response.json();
            console.log('Opportunity created:', result);
            gridContext?.addElem(opportunityParse(data));
            popUpContext.setOpen(false); // Close the form after successful submission
        } catch (error) {
            console.error('Error creating opportunity:', error);
        }
    };

    

    function opportunityParse(element: any){
        let newElem =  {
            id: element.id,
            organization: "",
            name: element.name,
            published: new Date(element.publication_date),
            beginning: new Date(element.start_date),
            end: new Date(element.end_date),
            type: "Convocatoria",
            image: "placeholder.png",
            content: element.content,
            interests: [],
            author: authContext.user?.username,
            country: "Mexico"
        };
        console.log(newElem);
        return newElem
    }


    return (
        <form
            onSubmit={(e) => {
                e.preventDefault(); // Prevent default behavior for debugging
                console.log('Form onSubmit triggered');
                handleSubmit(submitHandler)(e); // Call react-hook-form's handleSubmit

            }}
            className="space-y-4"
        >
            <h2 className="text-lg font-bold mb-4">Registro de Convocatoria</h2>
            {/* Name Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Nombre</label>
                <input
                    type="text"
                    {...register('name', { required: 'El nombre es obligatorio' })}
                    className="w-full px-3 py-2 border rounded-md"
                />
                {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            {/* Types Field */}
            {/* <div>
                <label className="block text-sm font-medium text-gray-700">Tipos</label>
                <select multiple {...register('type', { required: 'El tipo es obligatorio' })} className="w-full px-3 py-2 border rounded-md h-24">
                    {OpportunityTypes.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500">Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones</p>
                {errors.type && <span className="text-red-500 text-sm">{errors.type.message}</span>}
            </div> */}

            {/* Start and End Dates */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Inicio</label>
                    <input 
                        type="date" 
                        {...register('start_date', { required: 'La fecha de inicio es obligatoria' })} 
                        className="w-full px-3 py-2 border rounded-md" 
                    />
                    {errors.start_date && <span className="text-red-500 text-sm">{errors.start_date.message}</span>}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Fecha de Finalización</label>
                    <input 
                        type="date" 
                        {...register('end_date', { required: 'La fecha de finalización es obligatoria' })} 
                        className="w-full px-3 py-2 border rounded-md" 
                    />
                    {errors.end_date && <span className="text-red-500 text-sm">{errors.end_date.message}</span>}
                </div>
            </div>

            {/* Image Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Imagen</label>
                <input type="file" accept="image/*" {...register('image')} className="w-full px-3 py-2 border rounded-md" />
                {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
            </div>

            {/* Content Field */}
            <div>
                <label className="block text-sm font-medium text-gray-700">Descripción</label>
                <textarea {...register('content', { required: 'La descripción es obligatoria' })} rows={4} className="w-full px-3 py-2 border rounded-md"></textarea>
                {errors.content && <span className="text-red-500 text-sm">{errors.content.message}</span>}
            </div>

            {/* Interests Field */}
            {/* <div>
                <label className="block text-sm font-medium text-gray-700">Intereses</label>
                <select multiple {...register('interests', { required: 'El interés es obligatorio' })} className="w-full px-3 py-2 border rounded-md h-24">
                    {interests.map(interest => (
                        <option key={interest.id} value={interest.id}>{interest.name}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500">Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones</p>
                {errors.interests && <span className="text-red-500 text-sm">{errors.interests.message}</span>}
            </div> */}

            {/* Countries Field */}
            {/* <div>
                <label className="block text-sm font-medium text-gray-700">Países</label>
                <select multiple {...register('country', { required: 'El país es obligatorio' })} className="w-full px-3 py-2 border rounded-md h-24">
                    {countries.map(country => (
                        <option key={country.id} value={country.id}>{country.name}</option>
                    ))}
                </select>
                <p className="text-xs text-gray-500">Mantén presionado Ctrl (o Cmd en Mac) para seleccionar múltiples opciones</p>
                {errors.country && <span className="text-red-500 text-sm">{errors.country.message}</span>}
            </div> */}

            {/* Submit and Cancel Buttons */}
            <div className="flex gap-4">
                <button type="submit" disabled={!isValid} className={`flex-1 text-white py-2 rounded-md ${isValid ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400'}`}>
                    Publicar Convocatoria
                </button>
            </div>
        </form>
    );
};

export default RegisterOpportunity;