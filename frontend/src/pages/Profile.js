import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom'; // Import useParams
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { PersonCircle, Gear, BoxSeam, ToggleOn, ToggleOff } from 'react-bootstrap-icons'; // Import ToggleOn and ToggleOff icons
import ProfileSettings from './ProfileSettings'; // Import the settings component
import OrderHistory from '../components/OrderHistory'; // Import the OrderHistory component

const Profile = () => {
  const { user, token } = useAuth();
  const { id } = useParams(); // Get id from URL parameters
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [showOrderHistory, setShowOrderHistory] = useState(false); // New state for order history

  const fetchUserProfile = useCallback(async () => {
    if (token) { // Only proceed if authenticated
      setLoading(true);
      try {
        const profileId = id || user._id; // Use id from URL if present, otherwise current user's ID
        const endpoint = id ? `/users/${profileId}` : `/profile/me`; // Adjust endpoint based on id presence

        const response = await authenticatedFetch(endpoint);
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
  }, [user, token, id]); // Add id to dependencies

  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  const handleProfileUpdate = () => {
    fetchUserProfile(); // Refetch data when settings are updated
  };

  const handleStatusChange = async (newStatus) => {
    if (!user || user.role !== 'admin' || !profileData || !id) {
      setError('No autorizado para cambiar el estado del usuario.');
      return;
    }

    try {
      const response = await authenticatedFetch(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setProfileData((prevData) => ({ ...prevData, status: newStatus }));
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al actualizar el estado del usuario.');
      }
    } catch (err) {
      console.error('Error updating user status:', err);
      setError('Error de conexión al servidor al actualizar el estado.');
    }
  };

  // Hide settings and order history buttons if viewing another user's profile
  const isViewingOwnProfile = !id || (user && user._id === id);
  const canChangeStatus = user && user.role === 'admin' && !isViewingOwnProfile;

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
              <div className="flex justify-between py-3 border-b border-secondary">
                <span className="font-semibold text-secondary">Email:</span>
                <span className="text-text-primary">{profileData.email}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-secondary">
                <span className="font-semibold text-secondary">Rol:</span>
                <span className="text-text-primary capitalize">{profileData.role}</span>
              </div>
              <div className="flex justify-between py-3 border-b border-secondary"> {/* Added border-b */}
                <span className="font-semibold text-secondary">Estado:</span>
                <span className={`text-text-primary capitalize ${profileData.status === 'active' ? 'text-green-500' : 'text-red-500'}`}>
                  {profileData.status}
                </span>
              </div>
              <div className="flex justify-between py-3">
                <span className="font-semibold text-secondary">Miembro desde:</span>
                <span className="text-text-primary">{new Date(profileData.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            {canChangeStatus && (
              <div className="mt-8">
                {profileData.status === 'active' ? (
                  <button
                    onClick={() => handleStatusChange('inactive')}
                    className="inline-flex items-center gap-2 bg-red-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                  >
                    <ToggleOff className="w-5 h-5" />
                    Desactivar Usuario
                  </button>
                ) : (
                  <button
                    onClick={() => handleStatusChange('active')}
                    className="inline-flex items-center gap-2 bg-green-500 text-white py-2 px-6 rounded-lg shadow-md hover:bg-green-600 transition duration-300"
                  >
                    <ToggleOn className="w-5 h-5" />
                    Activar Usuario
                  </button>
                )}
              </div>
            )}
            {isViewingOwnProfile && ( // Only show these buttons if viewing own profile
              <div className="flex flex-col sm:flex-row gap-4 mt-8"> {/* Flex container for buttons */}
                <button
                  onClick={() => setIsSettingsOpen(true)}
                  className="inline-flex items-center gap-2 bg-primary text-white py-2 px-6 rounded-lg shadow-md hover:bg-primary-dark transition duration-300"
                >
                  <Gear className="w-5 h-5" />
                  Configuración de Perfil
                </button>
                <button
                  onClick={() => setShowOrderHistory(true)}
                  className="inline-flex items-center gap-2 bg-secondary text-white py-2 px-6 rounded-lg shadow-md hover:bg-secondary-dark transition duration-300"
                >
                  <BoxSeam className="w-5 h-5" />
                  Ver Historial de Pedidos
                </button>
              </div>
            )}
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

      {showOrderHistory && (
        <OrderHistory onClose={() => setShowOrderHistory(false)} />
      )}
    </>
  );
};

export default Profile;

