import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { publicFetch } from '../utils/api';
import { Heart, ChatSquareText, PersonCircle, Star, StarFill } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext'; // Import useAuth

const API_URL = "http://localhost:5000"; // Assuming backend runs on this URL

// Helper component for star ratings
const StarRating = ({ rating }) => {
  const totalStars = 5;
  const filledStars = Math.round(rating);

  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, index) =>
        index < filledStars ? (
          <StarFill key={index} className="w-4 h-4 text-yellow-400" />
        ) : (
          <Star key={index} className="w-4 h-4 text-gray-300" />
        )
      )}
    </div>
  );
};


const ServiceHistory = () => {
  const [serviceHistory, setServiceHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get user from context

  useEffect(() => {
    const fetchServiceHistory = async () => {
      try {
        const response = await publicFetch('/service-history');
        if (!response.ok) {
          throw new Error('No se pudieron cargar los historiales de servicio.');
        }
        const data = await response.json();
        setServiceHistory(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceHistory();
  }, []);

  const featuredServiceHistory = useMemo(() => {
    return [...serviceHistory].sort((a, b) => b.stars - a.stars).slice(0, 3);
  }, [serviceHistory]);

  const otherServiceHistory = useMemo(() => {
    return serviceHistory.filter(p => !featuredServiceHistory.some(fp => fp._id === p._id));
  }, [serviceHistory, featuredServiceHistory]);


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
    return <div className="bg-red-200 border border-500 text-red-600 px-4 py-3 rounded relative mx-auto my-4 max-w-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {user && user.role === 'admin' && (
        <div className="mb-8 text-right">
          <Link
            to="/admin-service-history-form"
            className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300"
          >
            Crear Nuevo Historial de Servicio
          </Link>
        </div>
      )}

      {/* Featured Service History Section */}
      {featuredServiceHistory.length > 0 && (
        <div className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center border-b-2 border-primary pb-3">Historial de Servicios Destacados</h2>
          <div className="flex flex-col gap-12">
            {featuredServiceHistory.map((serviceHistory) => (
              <div key={serviceHistory._id} className="bg-card-bg rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
                {serviceHistory.image && (
                  <img src={serviceHistory.image} className="w-full md:w-2/5 lg:w-1/3 h-64 md:h-auto object-cover" alt={serviceHistory.title} />
                )}
                <div className="p-6 flex flex-col flex-grow">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {serviceHistory.user?.profilePicture ? (
                          <img
                            src={serviceHistory.user.profilePicture.startsWith("http")
                              ? serviceHistory.user.profilePicture
                              : `${API_URL}/${serviceHistory.user.profilePicture}`}
                            alt={serviceHistory.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        ) : (
                          <PersonCircle className="w-12 h-12 text-secondary" />
                        )}
                        <div>
                          <p className="font-semibold text-text-primary">{serviceHistory.user?.name || 'Admin'}</p>
                          <p className="text-secondary text-sm">{new Date(serviceHistory.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <StarRating rating={serviceHistory.stars} />
                    </div>
                    <h5 className="text-3xl font-bold mb-3 text-text-primary">{serviceHistory.title}</h5>
                    <p className="text-text-secondary mb-6">
                      {serviceHistory.description.substring(0, 200)}...
                    </p>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <Link to={`/service-history/${serviceHistory._id}`} className="py-2 px-6 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition duration-300 text-center">
                      Leer Más
                    </Link>
                    <div className="flex items-center gap-6 text-secondary">
                      <span className="flex items-center gap-2">
                        <Heart className="w-5 h-5" />
                        <span className="font-medium">{serviceHistory.likes.length}</span>
                      </span>
                      <span className="flex items-center gap-2">
                        <ChatSquareText className="w-5 h-5" />
                        <span className="font-medium">{serviceHistory.comments.length}</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-8 text-center">Todos los Historiales de Servicio</h1>
      <div className="flex flex-col gap-12">
        {otherServiceHistory.length > 0 ? (
          otherServiceHistory.map((serviceHistory) => (
            <div key={serviceHistory._id} className="bg-card-bg rounded-xl shadow-lg flex flex-col md:flex-row overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1">
              {serviceHistory.image && (
                <img src={serviceHistory.image} className="w-full md:w-2/5 lg:w-1/3 h-64 md:h-auto object-cover" alt={serviceHistory.title} />
              )}
              <div className="p-6 flex flex-col flex-grow">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        {serviceHistory.user?.profilePicture ? (
                          <img
                            src={serviceHistory.user.profilePicture.startsWith("http")
                              ? serviceHistory.user.profilePicture
                              : `${API_URL}/${serviceHistory.user.profilePicture}`}
                            alt={serviceHistory.user.name}
                            className="w-12 h-12 rounded-full object-cover"
                            onError={(e) => e.target.style.display = 'none'}
                          />
                        ) : (
                          <PersonCircle className="w-12 h-12 text-secondary" />
                        )}
                      <div>
                        <p className="font-semibold text-text-primary">{serviceHistory.user?.name || 'Admin'}</p>
                        <p className="text-secondary text-sm">{new Date(serviceHistory.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <StarRating rating={serviceHistory.stars} />
                  </div>
                  <h5 className="text-3xl font-bold mb-3 text-text-primary">{serviceHistory.title}</h5>
                  <p className="text-text-secondary mb-6">
                    {serviceHistory.description.substring(0, 200)}...
                  </p>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <Link to={`/service-history/${serviceHistory._id}`} className="py-2 px-6 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-primary-dark transition duration-300 text-center">
                    Leer Más
                  </Link>
                  <div className="flex items-center gap-6 text-secondary">
                    <span className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">{serviceHistory.likes.length}</span>
                    </span>
                    <span className="flex items-center gap-2">
                      <ChatSquareText className="w-5 h-5" />
                      <span className="font-medium">{serviceHistory.comments.length}</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-secondary text-center">No hay más historiales de servicio publicados en este momento.</p>
        )}
      </div>
    </div>
  );
};

export default ServiceHistory;
