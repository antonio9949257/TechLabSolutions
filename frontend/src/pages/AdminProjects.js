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
    return <div className="text-center">Cargando...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gestionar Proyectos</h1>
        <Link to="/admin-project-form" className="btn btn-primary">
          Crear Nuevo Proyecto
        </Link>
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Título</th>
            <th>Fecha de Creación</th>
            <th>Likes</th>
            <th>Comentarios</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr key={project._id}>
              <td>{project.title}</td>
              <td>{new Date(project.createdAt).toLocaleDateString()}</td>
              <td>{project.likes.length}</td>
              <td>{project.comments.length}</td>
              <td>
                <Link to={`/projects/${project._id}`} className="btn btn-sm btn-info me-2">
                  Ver
                </Link>
                <Link to={`/admin-project-form/${project._id}`} className="btn btn-sm btn-warning me-2">
                  Editar
                </Link>
                <button onClick={() => handleDelete(project._id)} className="btn btn-sm btn-danger">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminProjects;
