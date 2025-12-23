import React, { useEffect, useState, useCallback } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { PersonCircle, Gear } from 'react-bootstrap-icons';
import ProfileSettings from './ProfileSettings'; // Import the settings component

const Profile = () => {
  const { user, token } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const fetchUserProfile = useCallback(async () => {
    if (user && token) {
      setLoading(true);
      try {
        const response = await authenticatedFetch('/profile/me');
        if (response.ok) {
          const data = await response.json();
          setProfileData(data);
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
  }, [user, token]);

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleProfileUpdate = () => {
    fetchUserProfile(); // Refetch data when settings are updated
  };

  if (loading && !profileData) { // Avoid full page loader when refetching
    return <div className="container mx-auto px-4 py-8 text-center">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 py-8 text-center text-red-600">Error: {error}</div>;
  }

  if (!profileData) {
    return <div className="container mx-auto px-4 py-8 text-center text-yellow-600">No se pudo cargar la información del perfil.</div>;
  }

  return (
    <>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto bg-card-bg rounded-2xl shadow-xl p-8">
          <div className="flex flex-col items-center">
            {profileData.profilePicture ? (
              <img
                src={profileData.profilePicture}
                alt="Foto de Perfil"
                className="w-32 h-32 rounded-full object-cover shadow-lg mb-4"
              />
            ) : (
              <PersonCircle className="w-32 h-32 text-secondary mb-4" />
            )}
            <h1 className="text-4xl font-bold text-text-primary">{profileData.name}</h1>
            {profileData.nickname && (
              <p className="text-xl text-secondary mt-1">@{profileData.nickname}</p>
            )}
            <div className="w-full mt-8">
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-600">Email:</span>
                <span className="text-gray-800">{profileData.email}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-gray-200">
                <span className="font-semibold text-gray-600">Rol:</span>
                <span className="text-gray-800 capitalize">{profileData.role}</span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-semibold text-gray-600">Miembro desde:</span>
                <span className="text-gray-800">{new Date(profileData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="mt-8 inline-flex items-center gap-2 bg-primary text-white py-2 px-6 rounded-lg shadow-md hover:bg-primary-dark transition duration-300"
            >
              <Gear className="w-5 h-5" />
              Configuración de Perfil
            </button>
          </div>
        </div>
      </div>

      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <ProfileSettings 
            onClose={() => setIsSettingsOpen(false)} 
            onProfileUpdate={handleProfileUpdate}
          />
        </div>
      )}
    </>
  );
};

export default Profile;
