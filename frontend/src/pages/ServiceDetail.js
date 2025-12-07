import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const response = await publicFetch(`/services/${id}`);
        if (response.ok) {
          const data = await response.json();
          setService(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar el servicio');
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  if (loading) {
    return <div className="container mt-5">Cargando servicio...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  if (!service) {
    return <div className="container mt-5">Servicio no encontrado.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={service.image}
            alt={service.name}
            className="img-fluid rounded"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <h2>{service.name}</h2>
          <p className="text-muted">Categoría: {service.category}</p>
          <p>{service.description}</p>
          {user ? (
            <>
              <h3 className="my-3">Precio: ${service.price.toFixed(2)}</h3>
              {/* Assuming services don't have stock but have availability */}
              <p>Disponibilidad: {service.availability ? 'Disponible' : 'No disponible'}</p>
              <Link to={`/quote/${service._id}`} className="btn btn-primary btn-lg mt-3">
                Solicitar Cotización
              </Link>
            </>
          ) : (
            <div className="alert alert-info">
              <Link to="/login">Inicia sesión</Link> para ver precios y más detalles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
