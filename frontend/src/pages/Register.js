import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api'; // Import authenticatedFetch

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await authenticatedFetch('/users/register', { // Use authenticatedFetch
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Registro exitoso');
        navigate('/login');
      } else {
        alert(data.message || 'Error en el registro');
      }
    } catch (error) {
      console.error('Error de red:', error);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
          <div className="bg-white p-8 rounded-lg shadow-lg">
            <h3 className="text-3xl font-bold text-center mb-6 text-gray-800">Crear Cuenta</h3>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre Completo</label>
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
                <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Correo Electrónico</label>
                <input
                  type="email"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
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
            <p className="mt-4 text-center text-gray-600">
              ¿Ya tienes una cuenta? <Link to="/login" className="text-blue-500 hover:text-blue-800">Inicia sesión aquí</Link>
            </p>
          </div>
        </div>
      </div>
  );
};

export default Register;
