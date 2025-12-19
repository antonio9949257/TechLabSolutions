import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { authenticatedFetch, publicFetch } from '../utils/api';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProjects = async () => {
    try {
      const response = await publicFetch('/projects');
      if (!response.ok) {
        throw new Error('No se pudieron cargar los proyectos.');
      }
      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        const response = await authenticatedFetch(`/projects/${id}`, { method: 'DELETE' });
        if (!response.ok) {
          throw new Error('No se pudo eliminar el proyecto.');
        }
        // Refetch projects after deletion
        fetchProjects();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto my-4 max-w-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestionar Proyectos</h1>
        <Link to="/admin-project-form" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
          Crear Nuevo Proyecto
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse bg-white shadow-md rounded-lg">
          <thead className="bg-gray-200 text-gray-700">
            <tr>
              <th className="py-3 px-4 text-left font-semibold">Título</th>
              <th className="py-3 px-4 text-left font-semibold">Fecha de Creación</th>
              <th className="py-3 px-4 text-left font-semibold">Likes</th>
              <th className="py-3 px-4 text-left font-semibold">Comentarios</th>
              <th className="py-3 px-4 text-left font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-3 px-4">{project.title}</td>
                <td className="py-3 px-4">{new Date(project.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">{project.likes.length}</td>
                <td className="py-3 px-4">{project.comments.length}</td>
                <td className="py-3 px-4">
                  <Link to={`/projects/${project._id}`} className="bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition duration-300 text-sm mr-2">
                    Ver
                  </Link>
                  <Link to={`/admin-project-form/${project._id}`} className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-300 text-sm mr-2">
                    Editar
                  </Link>
                  <button onClick={() => handleDelete(project._id)} className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition duration-300 text-sm">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminProjects;
