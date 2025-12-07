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
    return <div className="container mt-5">Cargando...</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          {service && (
            <div className="text-center mb-4">
              <h2>Solicitar Cotización para:</h2>
              <h3>{service.name}</h3>
              <img src={service.image} alt={service.name} className="img-fluid rounded my-3" style={{ maxHeight: '200px' }} />
            </div>
          )}

          <div className="card">
            <div className="card-body">
              <h4 className="card-title text-center">Completa tus datos</h4>
              {error && <div className="alert alert-danger">{error}</div>}
              {success && (
                <div className="alert alert-success">
                  ¡Cotización enviada con éxito! Gracias por contactarnos. Serás redirigido en unos segundos.
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">Nombre Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">Correo Electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="phone" className="form-label">Teléfono (Opcional)</label>
                  <input
                    type="tel"
                    className="form-control"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Mensaje</label>
                  <textarea
                    className="form-control"
                    id="message"
                    name="message"
                    rows="4"
                    value={formData.message}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Enviar Solicitud
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quote;
