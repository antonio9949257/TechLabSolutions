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
    return <div className="container mx-auto px-4 mt-8">Cargando servicio...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 mt-8 text-red-600">Error: {error}</div>;
  }

  if (!service) {
    return <div className="container mx-auto px-4 mt-8">Servicio no encontrado.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
          <img
            src={service.image}
            alt={service.name}
            className="max-w-full h-auto rounded-lg max-h-[500px] object-cover"
          />
        </div>
        <div className="w-full md:w-1/2 px-4">
          <h2 className="text-4xl font-bold mb-4">{service.name}</h2>
          <p className="text-gray-600 text-lg mb-2">Categoría: {service.category}</p>
          <p className="text-gray-700 mb-4">{service.description}</p>
          {user ? (
            <>
              <h3 className="text-2xl font-semibold my-4">Precio: ${service.price.toFixed(2)}</h3>
              {/* Assuming services don't have stock but have availability */}
              <p className="text-gray-700 mb-4">Disponibilidad: {service.availability ? 'Disponible' : 'No disponible'}</p>
              <Link to={`/quote/${service._id}`} className="py-3 px-6 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-lg mt-4">
                Solicitar Cotización
              </Link>
            </>
          ) : (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative my-4">
              <Link to="/login" className="text-blue-700 hover:underline">Inicia sesión</Link> para ver precios y más detalles.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;
