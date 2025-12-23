import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const ProfileSettings = ({ onClose, onProfileUpdate }) => {
  const { user, token, login, logout } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profilePictureFile, setProfilePictureFile] = useState(null);
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user && token) {
        try {
          const response = await authenticatedFetch('/profile/me');
          if (response.ok) {
            const data = await response.json();
            setName(data.name);
            setEmail(data.email);
            setNickname(data.nickname || '');
            setProfilePictureUrl(data.profilePicture || '');
          } else {
            const errorData = await response.json();
            setError(errorData.message || 'Error al cargar el perfil');
          }
        } catch (err) {
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
      formData.append('nickname', nickname);
      if (password) {
        formData.append('password', password);
      }
      if (profilePictureFile) {
        formData.append('profilePicture', profilePictureFile);
      }

      const response = await authenticatedFetch('/profile/me', {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        const updatedUser = await response.json();
        login({ ...user, ...updatedUser }); // Update context
        onProfileUpdate(); // Refetch profile data on parent
        setMessage('Perfil actualizado exitosamente. El modal se cerrará en 3 segundos...');
        setTimeout(() => {
          onClose(); // Close modal after a delay
        }, 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar el perfil');
      }
    } catch (err) {
      setError('Error de conexión al servidor');
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción es irreversible.')) {
      try {
        const response = await authenticatedFetch('/users/me', {
          method: 'DELETE',
        });

        if (response.ok) {
          logout();
          navigate('/login');
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al eliminar la cuenta');
        }
      } catch (err) {
        setError('Error de conexión al servidor');
      }
    }
  };

  return (
    <div className="relative bg-card-bg p-8 rounded-lg shadow-xl max-w-2xl w-full">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-2xl">&times;</button>
      <h2 className="text-3xl font-bold mb-6">Configuración de Perfil</h2>
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative my-4">{message}</div>}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative my-4">{error}</div>}
      
      {loading ? (
        <div>Cargando...</div>
      ) : (
        <>
          <form onSubmit={handleSubmit}>
            {/* Form fields remain the same */}
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="mb-4">
              <label htmlFor="nickname" className="block text-gray-700 text-sm font-bold mb-2">Nickname</label>
              <input type="text" id="nickname" value={nickname} onChange={(e) => setNickname(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="mb-4">
              <label htmlFor="profilePicture" className="block text-gray-700 text-sm font-bold mb-2">Foto de Perfil</label>
              <input type="file" id="profilePicture" onChange={(e) => setProfilePictureFile(e.target.files[0])} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
              {profilePictureUrl && !profilePictureFile && (
                <div className="mt-4"><img src={profilePictureUrl} alt="Profile" className="w-24 h-24 object-cover rounded-full" /></div>
              )}
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Nueva Contraseña</label>
              <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 text-sm font-bold mb-2">Confirmar Contraseña</label>
              <input type="password" id="confirmPassword" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" />
            </div>
            <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">Actualizar Perfil</button>
          </form>
          <div className="mt-8 border-t pt-6 border-red-300">
            <h3 className="text-lg font-bold text-red-700">Zona de Peligro</h3>
            <p className="text-sm text-gray-600 mb-4">La eliminación de la cuenta es permanente y no se puede deshacer.</p>
            <button
              type="button"
              onClick={handleDeleteAccount}
              className="bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700"
            >
              Eliminar Mi Cuenta
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ProfileSettings;

