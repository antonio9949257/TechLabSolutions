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
    return <div className="container mt-5">Cargando perfil...</div>;
  }

  if (error && error !== 'No autenticado.') {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  if (!user) {
    return <div className="container mt-5 text-warning">Por favor, inicia sesión para ver tu perfil.</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Configuración de Perfil</h2>
      {message && <div className="alert alert-success">{message}</div>}
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="name" className="form-label">Nombre</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="nickname" className="form-label">Nickname</label>
          <input
            type="text"
            className="form-control"
            id="nickname"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="profilePicture" className="form-label">Foto de Perfil</label>
          <input
            type="file"
            className="form-control"
            id="profilePicture"
            onChange={(e) => setProfilePictureFile(e.target.files[0])}
          />
          {profilePictureUrl && (
            <div className="mt-2">
              <p>Imagen actual:</p>
              <img src={profilePictureUrl} alt="Profile" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '50%' }} />
            </div>
          )}
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Nueva Contraseña (dejar en blanco para no cambiar)</label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="confirmPassword" className="form-label">Confirmar Nueva Contraseña</label>
          <input
            type="password"
            className="form-control"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <button type="submit" className="btn btn-primary">Actualizar Perfil</button>
      </form>
    </div>
  );
};

export default Profile;
