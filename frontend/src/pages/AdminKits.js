import React, { useState, useEffect, useCallback } from 'react';
import { authenticatedFetch } from '../utils/api';
import { Link } from 'react-router-dom';
import AdminEditKit from './AdminEditKit'; // Import AdminEditKit modal

const AdminKits = () => {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingKitId, setEditingKitId] = useState(null);

  const fetchKits = useCallback(async () => {
    try {
      const response = await authenticatedFetch('/kits');
      if (response.ok) {
        const data = await response.json();
        setKits(data);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Error al cargar kits');
      }
    } catch (err) {
      console.error('Error fetching kits:', err);
      setError('Error de conexión al servidor');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchKits();
  }, [fetchKits]);

  const handleEditClick = (kitId) => {
    setEditingKitId(kitId);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingKitId(null);
  };

  const handleEditSuccess = () => {
    fetchKits(); // Refresh the list of kits after successful edit
  };

  const handleDeleteKit = async (kitId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este kit?')) {
      try {
        const response = await authenticatedFetch(`/kits/${kitId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setSuccess('Kit eliminado exitosamente.');
          fetchKits(); // Refresh kit list
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al eliminar kit');
        }
      } catch (err) {
        console.error('Error deleting kit:', err);
        setError('Error de conexión al servidor');
      }
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 mt-8">Cargando kits...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 mt-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Gestión de Kits</h1>
        <Link
          to="/admin/create-kit"
          className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300"
        >
          Crear Nuevo Kit
        </Link>
      </div>

      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4">{success}</div>}

      {kits.length === 0 ? (
        <p className="text-gray-600">No hay kits registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Imagen</th>
                <th className="py-3 px-4 text-left font-semibold">Nombre</th>
                <th className="py-3 px-4 text-left font-semibold">Descripción</th>
                <th className="py-3 px-4 text-left font-semibold">Precio Total (sin desc.)</th>
                <th className="py-3 px-4 text-left font-semibold">Precio Final</th>
                <th className="py-3 px-4 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {kits.map((kit) => (
                <tr key={kit._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {kit.imageUrl && (
                      <img src={kit.imageUrl} alt={kit.name} className="w-16 h-16 object-cover rounded-md" />
                    )}
                  </td>
                  <td className="py-3 px-4">{kit.name}</td>
                  <td className="py-3 px-4">{kit.description.substring(0, 50)}...</td>
                  <td className="py-3 px-4">Bs {kit.totalPriceBeforeDiscount ? kit.totalPriceBeforeDiscount.toFixed(2) : 'N/A'}</td>
                  <td className="py-3 px-4">Bs {kit.finalPrice ? kit.finalPrice.toFixed(2) : 'N/A'}</td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => handleEditClick(kit._id)}
                      className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-300 text-sm mr-2"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteKit(kit._id)}
                      className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition duration-300 text-sm"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showEditModal && (
        <AdminEditKit
          kitId={editingKitId}
          onClose={handleCloseEditModal}
          onSuccess={handleEditSuccess}
        />
      )}
    </div>
  );
};

export default AdminKits;