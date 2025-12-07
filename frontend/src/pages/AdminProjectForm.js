import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { authenticatedFetch, publicFetch } from '../utils/api';

const AdminProjectForm = () => {
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
          const response = await publicFetch(`/projects/${id}`);
          if (!response.ok) {
            throw new Error('No se pudo cargar el proyecto para editar.');
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

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

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

    const url = isEditMode ? `/projects/${id}` : '/projects';
    const method = isEditMode ? 'PUT' : 'POST';

    try {
      // We don't stringify the body and don't set Content-Type header for FormData
      const response = await authenticatedFetch(url, {
        method,
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar el proyecto.');
      }

      navigate('/admin-projects');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-4">
      <h1>{isEditMode ? 'Editar Proyecto' : 'Crear Nuevo Proyecto'}</h1>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Título</label>
          <input
            type="text"
            className="form-control"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="description" className="form-label">Descripción</label>
          <textarea
            className="form-control"
            id="description"
            rows="10"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
        </div>
        {isEditMode && currentImage && (
          <div className="mb-3">
            <label className="form-label">Imagen Actual</label>
            <div>
              <img src={currentImage} alt="Imagen actual del proyecto" style={{ width: '200px', height: 'auto' }} />
            </div>
          </div>
        )}
        <div className="mb-3">
          <label htmlFor="image" className="form-label">
            {isEditMode ? 'Reemplazar Imagen' : 'Subir Imagen (Opcional)'}
          </label>
          <input
            type="file"
            className="form-control"
            id="image"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Guardando...' : 'Guardar Proyecto'}
        </button>
      </form>
    </div>
  );
};

export default AdminProjectForm;
