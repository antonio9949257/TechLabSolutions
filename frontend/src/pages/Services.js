import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await authenticatedFetch('/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar servicios');
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) {
    return <div className="container mt-5">Cargando servicios...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Nuestros Servicios</h2>
      {services.length === 0 ? (
        <p>No hay servicios disponibles en este momento.</p>
      ) : (
        <div className="row">
          {services.map((service) => (
            <div key={service._id} className="col-md-4 mb-4">
              <div className="card h-100">
                {service.image && (
                  <img
                    src={service.image}
                    className="card-img-top"
                    alt={service.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{service.name}</h5>
                  <p className="card-text flex-grow-1">{service.description}</p>
                  <p className="card-text"><strong>Categoría:</strong> {service.category}</p>
                  {user ? (
                    <p className="card-text"><strong>Precio:</strong> ${service.price.toFixed(2)}</p>
                  ) : (
                    <div className="text-center mt-auto">
                      <Link to="/login" className="btn btn-outline-primary w-100">
                        Inicia sesión para ver precios
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
