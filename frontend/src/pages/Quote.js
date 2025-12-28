import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { publicFetch } from '../utils/api';

const Quote = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchService = async () => {
      try {
        const response = await publicFetch(`/services/${serviceId}`);
        if (response.ok) {
          setService(await response.json());
        } else {
          setError('No se pudo cargar la información del servicio.');
        }
      } catch (err) {
        setError('Error de conexión al buscar el servicio.');
      } finally {
        setLoading(false);
      }
    };
    fetchService();
  }, [serviceId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    try {
      const response = await publicFetch('/quotes', {
        method: 'POST',
        body: JSON.stringify({ ...formData, serviceId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => navigate('/services'), 3000); // Redirect after 3s
      } else {
        setError(data.message || 'Ocurrió un error al enviar la cotización.');
      }
    } catch (err) {
      setError('Error de conexión. Por favor, inténtelo de nuevo.');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 mt-8">Cargando...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-center">
        <div className="w-full md:w-2/3 lg:w-1/2">
          {service && (
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold mb-2">Solicitar Cotización para:</h2>
              <h3 className="text-2xl font-semibold mb-4">{service.name}</h3>
              <img src={service.image} alt={service.name} className="max-w-full h-auto rounded-lg my-4 max-h-48 object-cover mx-auto" />
            </div>
          )}

          <div className="bg-card-bg rounded-lg shadow-lg p-6">
              <h4 className="text-xl font-bold text-center mb-6">Completa tus datos</h4>
              {error && <div className="bg-red-200 border border-red-500 text-red-600 px-4 py-3 rounded relative my-4">{error}</div>}
              {success && (
                <div className="bg-green-200 border border-green-500 text-green-600 px-4 py-3 rounded relative my-4">
                  ¡Cotización enviada con éxito! Gracias por contactarnos. Serás redirigido en unos segundos.
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="name" className="block text-secondary text-sm font-bold mb-2">Nombre Completo</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-text-primary leading-tight focus:outline-none focus:shadow-outline bg-background border-secondary focus:ring-primary"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-secondary text-sm font-bold mb-2">Correo Electrónico</label>
                  <input
                    type="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-text-primary leading-tight focus:outline-none focus:shadow-outline bg-background border-secondary focus:ring-primary"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-secondary text-sm font-bold mb-2">Teléfono (Opcional)</label>
                  <input
                    type="tel"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-text-primary leading-tight focus:outline-none focus:shadow-outline bg-background border-secondary focus:ring-primary"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="message" className="block text-secondary text-sm font-bold mb-2">Mensaje</label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-text-primary leading-tight focus:outline-none focus:shadow-outline h-32 bg-background border-secondary focus:ring-primary"
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="w-full">
                  <button type="submit" className="w-full bg-primary text-white py-3 px-6 rounded-md hover:opacity-90 transition duration-300 text-lg">
                    Enviar Solicitud
                  </button>
                </div>
              </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;
