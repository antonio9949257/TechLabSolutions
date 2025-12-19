import React, { useEffect, useState } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const { user, token, login } = useAuth(); // Get user, token, and login function to update context
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState(''); // New state for nickname
  const [password, setPassword] = useState(''); // For password change
  const [confirmPassword, setConfirmPassword] = useState(''); // For password change confirmation
  const [profilePictureFile, setProfilePictureFile] = useState(null); // New state for profile picture file
  const [profilePictureUrl, setProfilePictureUrl] = useState(''); // New state for displaying current profile picture
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && token) {
        try {
          const response = await authenticatedFetch('/profile');
          if (response.ok) {
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);
            setNickname(data.nickname || ''); // Initialize nickname
            setProfilePictureUrl(data.profilePicture || ''); // Initialize profile picture URL
          } else {
            const errorData = await response.json();
            setError(errorData.message || 'Error al cargar el perfil');
          }
        } catch (err) {
          console.error('Error fetching user profile:', err);
          setError('Error de conexión al servidor');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('No autenticado.');
      }
    };

    fetchUserProfile();
  }, [user, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('nickname', nickname); // Add nickname to formData
      if (password) {
        formData.append('password', password);
      }
      if (profilePictureFile) {
        formData.append('profilePicture', profilePictureFile); // Add profile picture file to formData
      }

      const response = await authenticatedFetch('/profile', {
        method: 'PUT',
        body: formData, // Send FormData
        // Do NOT set Content-Type header for FormData, browser sets it automatically
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setMessage('Perfil actualizado exitosamente');
        setName(updatedUser.name);
        setEmail(updatedUser.email);
        setNickname(updatedUser.nickname || ''); // Update nickname state
        setProfilePictureUrl(updatedUser.profilePicture || ''); // Update profile picture URL state
        setPassword('');
        setConfirmPassword('');
        setProfilePictureFile(null); // Clear file input

        // Update the user object in AuthContext
        login({ ...user, ...updatedUser });
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setError('Error de conexión al servidor');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 mt-8">Cargando perfil...</div>;
  }

  if (error && error !== 'No autenticado.') {
    return <div className="container mx-auto px-4 mt-8 text-red-600">Error: {error}</div>;
  }

  if (!user) {
    return <div className="container mx-auto px-4 mt-8 text-yellow-600">Por favor, inicia sesión para ver tu perfil.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Configuración de Perfil</h2>
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative my-4">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
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
          <label htmlFor="nickname" className="block text-gray-700 text-sm font-bold mb-2">Nickname</label>
          <input
            type="text"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
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
          <label htmlFor="profilePicture" className="block text-gray-700 text-sm font-bold mb-2">Foto de Perfil</label>
          <input
            type="file"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="profilePicture"
            onChange={(e) => setProfilePictureFile(e.target.files[0])}
          />
          {profilePictureUrl && (
            <div className="mt-4">
              <p className="text-gray-700 mb-2">Imagen actual:</p>
              <img src={profilePictureUrl} alt="Profile" className="w-24 h-24 object-cover rounded-full" />
            </div>
          )}
        </div>
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Nueva Contraseña (dejar en blanco para no cambiar)</label>
          <input
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-6">
          <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Actualizar Perfil</button>
      </form>
    </div>
  );
};

export default Profile;
