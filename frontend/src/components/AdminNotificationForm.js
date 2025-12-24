import React, { useState } from 'react';
import { authenticatedFetch } from '../utils/api';

const AdminNotificationForm = ({ onClose }) => {
  const [message, setMessage] = useState('');
  const [link, setLink] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      const response = await authenticatedFetch('/notifications/send', {
        method: 'POST',
        body: JSON.stringify({ message, link, recipient: 'all' }), // 'all' for now
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(data.message);
        setMessage('');
        setLink('');
      } else {
        setError(data.message || 'Error al enviar la notificación');
      }
    } catch (err) {
      console.error('Error sending notification:', err);
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 bg-card-bg rounded-lg shadow-lg">
      <h4 className="text-xl font-bold mb-4 text-text-primary">Enviar Notificación a Usuarios</h4>
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="message" className="block text-text-primary text-sm font-bold mb-2">Mensaje</label>
          <textarea
            id="message"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            rows="3"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            disabled={loading}
          ></textarea>
        </div>
        <div className="mb-4">
          <label htmlFor="link" className="block text-text-primary text-sm font-bold mb-2">Enlace (opcional)</label>
          <input
            type="url"
            id="link"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={link}
            onChange={(e) => setLink(e.target.value)}
            disabled={loading}
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Notificación'}
          </button>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              disabled={loading}
            >
              Cerrar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default AdminNotificationForm;
