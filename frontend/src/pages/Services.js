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
    return <div className="container mx-auto px-4 mt-8">Cargando servicios...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 mt-8 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Nuestros Servicios</h2>
      {services.length === 0 ? (
        <p className="text-secondary">No hay servicios disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service._id} className="bg-card-bg rounded-lg shadow-md h-full flex flex-col">
              {service.image && (
                <img
                  src={service.image}
                  className="w-full h-48 object-cover rounded-t-lg"
                  alt={service.name}
                />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h5 className="text-xl font-semibold mb-2">{service.name}</h5>
                <p className="text-secondary mb-2 flex-grow">{service.description}</p>
                <p className="text-secondary"><strong>Categoría:</strong> {service.category}</p>
                {user ? (
                  <p className="text-secondary font-bold mt-2"><strong>Precio:</strong> Bs {service.price.toFixed(2)}</p>
                ) : (
                  <div className="text-center mt-auto">
                    <Link to="/login" className="w-full py-2 px-4 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition duration-300 text-center">
                      Inicia sesión para ver precios
                    </Link>
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-secondary">
                <div className="flex space-x-2">
                  <Link to={`/services/${service._id}`} className="flex-1 py-2 px-4 border border-secondary rounded-md text-secondary hover:bg-background transition duration-300 text-center">
                    Ver Detalles
                  </Link>
                  <Link to={`/quote/${service._id}`} className="flex-1 py-2 px-4 bg-primary text-white rounded-md hover:opacity-90 transition duration-300 text-center">
                    Cotización
                  </Link>
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
