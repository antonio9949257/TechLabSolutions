import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authenticatedFetch, publicFetch } from '../utils/api';
import ImageUpload from '../components/ImageUpload'; // Import the new component

const AdminServiceHistoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [currentImage, setCurrentImage] = useState(''); // To display the existing image
  const [imageFile, setImageFile] = useState(null); // To hold the new file
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode) {
      const fetchProject = async () => {
        try {
          const response = await publicFetch(`/service-history/${id}`);
          if (!response.ok) {
            throw new Error('No se pudo cargar el historial de servicio para editar.');
          }
          const data = await response.json();
          setTitle(data.title);
          setDescription(data.description);
          setCurrentImage(data.image || '');
        } catch (err) {
          setError(err.message);
        }
      };
      fetchProject();
    }
  }, [id, isEditMode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    if (imageFile) {
      formData.append('image', imageFile);
    }

    const url = isEditMode ? `/service-history/${id}` : '/service-history';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      // We don't stringify the body and don't set Content-Type header for FormData
      const response = await authenticatedFetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el historial de servicio.');
      }

      navigate('/admin-service-history');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{isEditMode ? 'Editar Historial de Servicio' : 'Crear Nuevo Historial de Servicio'}</h1>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-text-primary text-sm font-bold mb-2">Título</label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-text-primary bg-background leading-tight focus:outline-none focus:shadow-outline"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="description" className="block text-text-primary text-sm font-bold mb-2">Descripción</label>
          <textarea
            className="shadow appearance-none border rounded w-full py-2 px-3 text-text-primary bg-background leading-tight focus:outline-none focus:shadow-outline h-40"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="mb-6">
          <ImageUpload
            fieldName="image"
            onFileSelect={setImageFile}
            existingImageUrl={currentImage}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Historial de Servicio'}
        </button>
      </form>
    </div>
  );
};

export default AdminServiceHistoryForm;