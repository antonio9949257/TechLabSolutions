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
      <div className="flex items-center justify-center h-screen-1/2">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-4 border-primary">
          <span className="sr-only">Cargando...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-200 border border-red-500 text-red-600 px-4 py-3 rounded relative mx-auto my-4 max-w-lg">{error}</div>;
  }

  if (!project) {
    return null;
  }

  const hasLiked = user && project.likes.includes(user._id);

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/projects" className="inline-block bg-secondary hover:opacity-90 text-text-primary font-bold py-2 px-4 rounded mb-6">Volver a Proyectos</Link>
      <div className="bg-card-bg rounded-lg shadow-lg">
        {project.image && <img src={project.image} className="w-full h-96 object-cover rounded-t-lg" alt={project.title} />}
        <div className="p-6">
          <h1 className="text-4xl font-bold mb-2">{project.title}</h1>
          <p className="text-secondary text-sm mb-4">
            Publicado por {project.user?.name || 'Admin'} el {new Date(project.createdAt).toLocaleDateString()}
          </p>
          <p className="text-secondary mb-4" style={{ whiteSpace: 'pre-wrap' }}>{project.description}</p>
          <hr className="border-t border-secondary my-6" />
          <div className="flex items-center">
            <button onClick={handleLike} className={`py-2 px-4 rounded transition duration-300 ${hasLiked ? 'bg-primary text-white hover:opacity-90' : 'border border-primary text-primary hover:bg-primary hover:text-white'}`} disabled={!user}>
              <i className={`fas fa-heart mr-2 ${hasLiked ? 'text-white' : ''}`}></i>
              {hasLiked ? 'Te gusta' : 'Me gusta'}
            </button>
            <span className="ml-3 text-secondary">{project.likes.length} Me gusta</span>
          </div>
        </div>
      </div>

      {/* Comments Section */}
      <div className="mt-8">
        <h3 className="text-2xl font-bold mb-4">Comentarios ({project.comments.length})</h3>
        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-6">
            <div className="mb-4">
              <textarea
                className="w-full px-3 py-2 border border-secondary rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                rows="3"
                placeholder="Escribe tu comentario..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                required
              ></textarea>
            </div>
            <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition duration-300" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar Comentario'}
            </button>
          </form>
        ) : (
          <p className="text-secondary"><Link to="/login" className="text-primary hover:underline">Inicia sesión</Link> para dejar un comentario.</p>
        )}
        
        <div className="space-y-4">
          {project.comments.slice().reverse().map((comment) => (
            <div key={comment._id} className="bg-card-bg p-4 rounded-lg shadow-sm flex flex-col items-start">
              <div className="flex justify-between w-full mb-1">
                <h5 className="text-lg font-semibold">{comment.name}</h5>
                <small className="text-secondary text-sm">{new Date(comment.createdAt).toLocaleString()}</small>
              </div>
              <p className="text-secondary">{comment.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
