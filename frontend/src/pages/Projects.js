import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { publicFetch } from '../utils/api';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchProjects();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen-1/2">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-blue-500">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto my-4 max-w-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Proyectos de TechLab</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} className="bg-white rounded-lg shadow-md h-full flex flex-col">
              {project.image && (
                <img src={project.image} className="w-full h-48 object-cover rounded-t-lg" alt={project.title} />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h5 className="text-xl font-semibold mb-2">{project.title}</h5>
                <p className="text-gray-600 text-sm mb-2">
                  Publicado por {project.user?.name || 'Admin'}
                </p>
                <p className="text-gray-700 mb-4 flex-grow">
                  {project.description.substring(0, 100)}...
                </p>
                <Link to={`/projects/${project._id}`} className="mt-auto py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-center">
                  Leer Más y Comentar
                </Link>
              </div>
              <div className="p-4 border-t border-gray-200 text-gray-500 text-sm">
                <small>{new Date(project.createdAt).toLocaleDateString()}</small>
                <span className="float-right">
                  <i className="fas fa-heart mr-1"></i>{project.likes.length}
                  <i className="fas fa-comment ml-2 mr-1"></i>{project.comments.length}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-600">No hay proyectos publicados en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
