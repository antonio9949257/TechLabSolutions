import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Keep navigate for OIDC redirect
import { authenticatedFetch } from '../utils/api';
import { XCircle } from 'react-bootstrap-icons'; // Import XCircle for close button

const RegisterModal = ({ onClose, onSuccess, openLoginModal }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Keep navigate for OIDC redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    try {
      const response = await authenticatedFetch('/users/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password, whatsappNumber }),
      });

      const data = await response.json();

      if (response.ok) {
        onSuccess(); // Call onSuccess callback
        onClose(); // Close the modal
      } else {
        setError(data.message || 'Error en el registro');
      }
    } catch (err) {
      console.error('Error de red:', err);
      setError('Error de conexión con el servidor');
    }
  };

  const handleOIDCLogin = () => {
    // Redirect to the backend's OIDC initiation endpoint
    // This will navigate away from the current page, so modal will close
    window.location.href = 'http://localhost:5000/api/users/auth/google';
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="relative w-full max-w-md bg-card-bg p-8 rounded-lg shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl"
        >
          <XCircle className="w-7 h-7" />
        </button>
        <h3 className="text-3xl font-bold text-center mb-6 text-text-primary">Crear Cuenta</h3>
        {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-text-primary text-sm font-bold mb-2">Nombre Completo</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-text-primary text-sm font-bold mb-2">Correo Electrónico</label>
            <input
              type="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="whatsappNumber" className="block text-text-primary text-sm font-bold mb-2">Número de WhatsApp</label>
            <input
              type="text"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="whatsappNumber"
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
            />
          </div>
          <div className="mb-6">
            <label htmlFor="password" className="block text-text-primary text-sm font-bold mb-2">Contraseña</label>
            <input
              type="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full">Registrarse</button>
          </div>
        </form>
        <div className="mt-4">
          <button
            onClick={handleOIDCLogin}
            className="bg-black hover:bg-gray-800 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full flex items-center justify-center"
          >
            <img src="https://img.icons8.com/color/16/000000/google-logo.png" alt="Google logo" className="mr-2" />
            Registrarse con Google
          </button>
        </div>
        <p className="mt-4 text-center text-text-primary">
          ¿Ya tienes una cuenta?{' '}
          <button
            onClick={() => {
              onClose(); // Close register modal
              openLoginModal(); // Open login modal
            }}
            className="text-blue-500 hover:text-blue-800 font-bold"
          >
            Inicia sesión aquí
          </button>
        </p>
      </div>
    </div>
  );
};

export default RegisterModal;