import React, { useState, useEffect } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AdminServiceHistory = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/login'); // Redirect non-admin users
      return;
    }

    const fetchQuotes = async () => {
      try {
        const response = await authenticatedFetch('/quotes');
        if (response.ok) {
          const data = await response.json();
          setQuotes(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar las cotizaciones');
        }
      } catch (err) {
        console.error('Error fetching quotes:', err);
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };

    fetchQuotes();
  }, [user, token, navigate]);

  

  const handleStatusChange = async (quoteId, newStatus) => {
    try {
      const response = await authenticatedFetch(`/quotes/${quoteId}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setQuotes((prevQuotes) =>
          prevQuotes.map((quote) =>
            quote._id === quoteId ? { ...quote, status: newStatus } : quote
          )
        );
        alert('Estado de la cotización actualizado con éxito.');
      } else {
        const errorData = await response.json();
        alert(`Error al actualizar el estado: ${errorData.message}`);
      }
    } catch (err) {
      console.error('Error updating quote status:', err);
      alert('Error de conexión al servidor al actualizar el estado.');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando...</div>;
  }

  if (error) {
    return <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mx-auto my-4 max-w-lg">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6 text-text-primary">Gestión de Solicitudes de Cotización</h2>
      {quotes.length === 0 ? (
        <p className="text-center text-gray-600">No hay solicitudes de cotización para mostrar.</p>
      ) : (
        <div className="overflow-x-auto bg-card-bg shadow-lg rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-background">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Cotización</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Servicio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
              </tr>
            </thead>
            <tbody className="bg-card-bg divide-y divide-gray-200">
              {quotes.map((quote) => (
                <tr key={quote._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-text-primary">{quote._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{quote.service?.name || 'N/A'}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{quote.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{quote.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{quote.phone || 'N/A'}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{quote.message}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{new Date(quote.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      quote.status === 'Cerrado' ? 'bg-green-100 text-green-800' :
                      quote.status === 'Contactado' ? 'bg-blue-100 text-blue-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {quote.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select
                      value={quote.status}
                      onChange={(e) => handleStatusChange(quote._id, e.target.value)}
                      className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                    >
                      <option value="Nuevo">Nuevo</option>
                      <option value="Contactado">Contactado</option>
                      <option value="Cerrado">Cerrado</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminServiceHistory;
