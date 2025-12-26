import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../utils/api';

const SectionEditModal = ({ section, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    backgroundImage: '',
    content: [],
  });
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (section) {
      setFormData({
        title: section.title || '',
        subtitle: section.subtitle || '',
        backgroundImage: section.backgroundImage || '',
        content: section.content || [],
      });
    }
  }, [section]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleContentChange = (index, e) => {
    const newContent = [...formData.content];
    newContent[index] = { ...newContent[index], [e.target.name]: e.target.value };
    setFormData({ ...formData, content: newContent });
  };

  const handleImageChange = (e) => {
    setNewImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('subtitle', formData.subtitle);
      data.append('backgroundImage', formData.backgroundImage); // Keep existing image URL
      data.append('content', JSON.stringify(formData.content));
      if (newImage) {
        data.append('image', newImage); // Append new image file
      }

      const response = await authenticatedFetch(`/home-sections/admin/${section._id}`, {
        method: 'PUT',
        body: data, // FormData
        // Do NOT set Content-Type header for FormData, browser sets it automatically
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update section');
      }

      onSave(); // Callback to refresh sections in parent
      onClose(); // Close modal
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!section) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
        <h3 className="text-2xl font-bold mb-4">Editar Sección: {section.name}</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
              Título
            </label>
            <input
              type="text"
              name="title"
              id="title"
              value={formData.title}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="subtitle">
              Subtítulo
            </label>
            <input
              type="text"
              name="subtitle"
              id="subtitle"
              value={formData.subtitle}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="backgroundImage">
              Imagen de Fondo (URL actual)
            </label>
            <input
              type="text"
              name="backgroundImage"
              id="backgroundImage"
              value={formData.backgroundImage}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
            {formData.backgroundImage && (
              <img src={formData.backgroundImage} alt="Current Background" className="mt-2 w-32 h-auto object-cover" />
            )}
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newImage">
              Subir Nueva Imagen de Fondo
            </label>
            <input
              type="file"
              name="newImage"
              id="newImage"
              accept="image/*"
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </div>

          {/* Dynamic Content Editing */}
          {formData.content && formData.content.length > 0 && (
            <div className="mb-4 border-t pt-4">
              <h4 className="text-lg font-semibold mb-2">Contenido de la Sección</h4>
              {formData.content.map((item, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md mb-3">
                  <p className="font-medium mb-2">Elemento {index + 1}</p>
                  {Object.keys(item).map((key) => (
                    <div key={key} className="mb-2">
                      <label className="block text-gray-700 text-xs font-bold mb-1" htmlFor={`content-${index}-${key}`}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}
                      </label>
                      <input
                        type="text"
                        name={key}
                        id={`content-${index}-${key}`}
                        value={item[key]}
                        onChange={(e) => handleContentChange(index, e)}
                        className="shadow appearance-none border rounded w-full py-1 px-2 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SectionEditModal;
