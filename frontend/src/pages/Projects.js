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
      <div className="d-flex justify-content-center align-items-center" style={{ height: '50vh' }}>
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Proyectos de TechLab</h1>
      <div className="row">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div key={project._id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100">
                {project.image && (
                  <img src={project.image} className="card-img-top" alt={project.title} style={{ height: '200px', objectFit: 'cover' }} />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{project.title}</h5>
                  <p className="card-text text-muted">
                    Publicado por {project.user?.name || 'Admin'}
                  </p>
                  <p className="card-text flex-grow-1">
                    {project.description.substring(0, 100)}...
                  </p>
                  <Link to={`/projects/${project._id}`} className="btn btn-primary mt-auto">
                    Leer Más y Comentar
                  </Link>
                </div>
                <div className="card-footer text-muted">
                  <small>{new Date(project.createdAt).toLocaleDateString()}</small>
                  <span className="float-end">
                    <i className="fas fa-heart me-1"></i>{project.likes.length}
                    <i className="fas fa-comment ms-2 me-1"></i>{project.comments.length}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No hay proyectos publicados en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default Projects;
