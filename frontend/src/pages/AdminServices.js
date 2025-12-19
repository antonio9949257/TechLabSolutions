import React, { useEffect, useState, useCallback } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminServices = () => {
  const { user } = useAuth();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Create Service form
  const [newServiceName, setNewServiceName] = useState('');
  const [newServiceDescription, setNewServiceDescription] = useState('');
  const [newServicePrice, setNewServicePrice] = useState('');
  const [newServiceCategory, setNewServiceCategory] = useState('');
  const [newServiceImage, setNewServiceImage] = useState(null); // For file input

  // State for Edit Service modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editServiceName, setEditServiceName] = useState('');
  const [editServiceDescription, setEditServiceDescription] = useState('');
  const [editServicePrice, setEditServicePrice] = useState('');
  const [editServiceCategory, setEditServiceCategory] = useState('');
  const [editServiceImage, setEditServiceImage] = useState(null); // For file input

  // State for Create Service Modal visibility
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchServices = useCallback(async () => {
    if (user && user.role === 'admin') {
      try {
        const response = await authenticatedFetch('/services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar servicios');
        }
      } catch (err) {
        console.error('Error fetching services:', err);
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('No tienes permisos para ver esta página.');
    }
  }, [user]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const handleCreateService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newServiceName);
    formData.append('description', newServiceDescription);
    formData.append('price', newServicePrice);
    formData.append('category', newServiceCategory);
    if (newServiceImage) {
      formData.append('image', newServiceImage);
    }

    try {
      const response = await authenticatedFetch('/services', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Servicio creado exitosamente');
        setNewServiceName('');
        setNewServiceDescription('');
        setNewServicePrice('');
        setNewServiceCategory('');
        setNewServiceImage(null);
        setShowCreateModal(false); // Close modal
        fetchServices(); // Refresh service list
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al crear servicio');
      }
    } catch (err) {
      console.error('Error creating service:', err);
      alert('Error de conexión al servidor');
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este servicio?')) {
      try {
        const response = await authenticatedFetch(`/services/${serviceId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Servicio eliminado exitosamente');
          fetchServices(); // Refresh service list
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Error al eliminar servicio');
        }
      } catch (err) {
        console.error('Error deleting service:', err);
        alert('Error de conexión al servidor');
      }
    }
  };

  const handleEditClick = (serviceToEdit) => {
    setEditingService(serviceToEdit);
    setEditServiceName(serviceToEdit.name);
    setEditServiceDescription(serviceToEdit.description);
    setEditServicePrice(serviceToEdit.price);
    setEditServiceCategory(serviceToEdit.category);
    setEditServiceImage(null); // Clear previous image selection
    setShowEditModal(true);
  };

  const handleUpdateService = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editServiceName);
    formData.append('description', editServiceDescription);
    formData.append('price', editServicePrice);
    formData.append('category', editServiceCategory);
    if (editServiceImage) {
      formData.append('image', editServiceImage);
    }

    try {
      const response = await authenticatedFetch(`/services/${editingService._id}`, {
        method: 'PUT',
        body: formData,
      });

      if (response.ok) {
        alert('Servicio actualizado exitosamente');
        setShowEditModal(false);
        setEditingService(null);
        fetchServices(); // Refresh service list
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al actualizar servicio');
      }
    } catch (err) {
      console.error('Error updating service:', err);
      alert('Error de conexión al servidor');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 mt-8">Cargando servicios...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 mt-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Gestión de Servicios</h2>

      {/* Button to open Create Service Modal */}
      <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-6" onClick={() => setShowCreateModal(true)}>
        Crear Nuevo Servicio
      </button>

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h5 className="text-xl font-bold">Crear Nuevo Servicio</h5>
              <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => setShowCreateModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="py-4">
              <form onSubmit={handleCreateService}>
                <div className="mb-4">
                  <label htmlFor="newServiceName" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newServiceName"
                    value={newServiceName}
                    onChange={(e) => setNewServiceName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newServiceDescription" className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newServiceDescription"
                    value={newServiceDescription}
                    onChange={(e) => setNewServiceDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="newServicePrice" className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newServicePrice"
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newServiceCategory" className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newServiceCategory"
                    value={newServiceCategory}
                    onChange={(e) => setNewServiceCategory(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="newServiceImage" className="block text-gray-700 text-sm font-bold mb-2">Imagen</label>
                  <input
                    type="file"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newServiceImage"
                    onChange={(e) => setNewServiceImage(e.target.files[0])}
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">Crear Servicio</button>
                  <button type="button" className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 ml-2" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Service List Table */}
      <h3 className="text-2xl font-bold mb-4">Servicios Existentes</h3>
      {services.length === 0 ? (
        <p className="text-gray-600">No hay servicios registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Imagen</th>
                <th className="py-3 px-4 text-left font-semibold">Nombre</th>
                <th className="py-3 px-4 text-left font-semibold">Categoría</th>
                <th className="py-3 px-4 text-left font-semibold">Precio</th>
                <th className="py-3 px-4 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {services.map((s) => (
                <tr key={s._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {s.image && (
                      <img src={s.image} alt={s.name} className="w-12 h-12 object-cover rounded-md" />
                    )}
                  </td>
                  <td className="py-3 px-4">{s.name}</td>
                  <td className="py-3 px-4">{s.category}</td>
                  <td className="py-3 px-4">${s.price.toFixed(2)}</td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-300 text-sm mr-2"
                      onClick={() => handleEditClick(s)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition duration-300 text-sm"
                      onClick={() => handleDeleteService(s._id)}
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
      {/* Edit Service Modal */}
      {showEditModal && editingService && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h5 className="text-xl font-bold">Editar Servicio</h5>
              <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => setShowEditModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="py-4">
              <form onSubmit={handleUpdateService}>
                <div className="mb-4">
                  <label htmlFor="editServiceName" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editServiceName"
                    value={editServiceName}
                    onChange={(e) => setEditServiceName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editServiceDescription" className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editServiceDescription"
                    value={editServiceDescription}
                    onChange={(e) => setEditServiceDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="editServicePrice" className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editServicePrice"
                    value={editServicePrice}
                    onChange={(e) => setEditServicePrice(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editServiceCategory" className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editServiceCategory"
                    value={editServiceCategory}
                    onChange={(e) => setEditServiceCategory(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="editServiceImage" className="block text-gray-700 text-sm font-bold mb-2">Imagen</label>
                  <input
                    type="file"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editServiceImage"
                    onChange={(e) => setEditServiceImage(e.target.files[0])}
                  />
                  {editingService.image && (
                    <div className="mt-4">
                      <p className="text-gray-700 mb-2">Imagen actual:</p>
                      <img src={editingService.image} alt="Current Service" className="w-24 h-24 object-cover rounded-md" />
                    </div>
                  )}
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">Guardar Cambios</button>
                  <button type="button" className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 ml-2" onClick={() => setShowEditModal(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;