import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicFetch, authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProjectDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchProject = useCallback(async () => {
    try {
      const response = await publicFetch(`/projects/${id}`);
      if (!response.ok) {
        throw new Error('Proyecto no encontrado.');
      }
      const data = await response.json();
      setProject(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProject();
  }, [fetchProject]);

  const handleLike = async () => {
    if (!user) return; // Or redirect to login
    try {
      const response = await authenticatedFetch(`/projects/${id}/like`, { method: 'PUT' });
      if (response.ok) {
        const data = await response.json();
        setProject(data);
      }
    } catch (err) {
      console.error('Error al dar me gusta:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setIsSubmitting(true);
    try {
      const response = await authenticatedFetch(`/projects/${id}/comment`, {
        method: 'POST',
        body: JSON.stringify({ text: commentText }),
      });
      if (response.ok) {
        const data = await response.json();
        setProject(data);
        setCommentText('');
      }
    } catch (err) {
      console.error('Error al comentar:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

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

  if (!project) {
    return null;
  }

  const hasLiked = user && project.likes.includes(user._id);

  return (
    <div className="container mt-4">
      <Link to="/projects" className="btn btn-light mb-3">Volver a Proyectos</Link>
      <div className="card">
        {project.image && <img src={project.image} className="card-img-top" alt={project.title} />}
        <div className="card-body">
          <h1 className="card-title">{project.title}</h1>
          <p className="card-text text-muted">
            Publicado por {project.user?.name || 'Admin'} el {new Date(project.createdAt).toLocaleDateString()}
          </p>
          <p className="card-text" style={{ whiteSpace: 'pre-wrap' }}>{project.description}</p>
          <hr />
          <div className="d-flex align-items-center">
            <button onClick={handleLike} className={`btn ${hasLiked ? 'btn-primary' : 'btn-outline-primary'}`} disabled={!user}>
              <i className={`fas fa-heart me-2 ${hasLiked ? 'text-white' : ''}`}></i>
              {hasLiked ? 'Te gusta' : 'Me gusta'}
            </button>
            <span className="ms-3 text-muted">{project.likes.length} Me gusta</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-4">
        <h3>Comentarios ({project.comments.length})</h3>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <div className="mb-3">
              <textarea
                className="form-control"
                rows="3"
                placeholder="Escribe tu comentario..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-success" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
            </button>
          </form>
        ) : (
          <p><Link to="/login">Inicia sesión</Link> para dejar un comentario.</p>
        )}
        
        <div className="list-group">
          {project.comments.slice().reverse().map((comment) => (
            <div key={comment._id} className="list-group-item list-group-item-action flex-column align-items-start">
              <div className="d-flex w-100 justify-content-between">
                <h5 className="mb-1">{comment.name}</h5>
                <small>{new Date(comment.createdAt).toLocaleString()}</small>
              </div>
              <p className="mb-1">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
