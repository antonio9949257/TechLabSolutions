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
    return <div className="container mt-5">Cargando servicios...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Gestión de Servicios</h2>

      {/* Button to open Create Service Modal */}
      <button className="btn btn-primary mb-4" onClick={() => setShowCreateModal(true)}>
        Crear Nuevo Servicio
      </button>

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Nuevo Servicio</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateService}>
                  <div className="mb-3">
                    <label htmlFor="newServiceName" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="newServiceName"
                      value={newServiceName}
                      onChange={(e) => setNewServiceName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newServiceDescription" className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      id="newServiceDescription"
                      value={newServiceDescription}
                      onChange={(e) => setNewServiceDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newServicePrice" className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      id="newServicePrice"
                      value={newServicePrice}
                      onChange={(e) => setNewServicePrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newServiceCategory" className="form-label">Categoría</label>
                    <input
                      type="text"
                      className="form-control"
                      id="newServiceCategory"
                      value={newServiceCategory}
                      onChange={(e) => setNewServiceCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newServiceImage" className="form-label">Imagen</label>
                    <input
                      type="file"
                      className="form-control"
                      id="newServiceImage"
                      onChange={(e) => setNewServiceImage(e.target.files[0])}
                    />
                  </div>
                  <button type="submit" className="btn btn-success">Crear Servicio</button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service List Table */}
      <h3>Servicios Existentes</h3>
      {services.length === 0 ? (
        <p>No hay servicios registrados.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {services.map((s) => (
              <tr key={s._id}>
                <td>
                  {s.image && (
                    <img src={s.image} alt={s.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  )}
                </td>
                <td>{s.name}</td>
                <td>{s.category}</td>
                <td>${s.price.toFixed(2)}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditClick(s)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteService(s._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Service Modal */}
      {showEditModal && editingService && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Servicio</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateService}>
                  <div className="mb-3">
                    <label htmlFor="editServiceName" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editServiceName"
                      value={editServiceName}
                      onChange={(e) => setEditServiceName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editServiceDescription" className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      id="editServiceDescription"
                      value={editServiceDescription}
                      onChange={(e) => setEditServiceDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editServicePrice" className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      id="editServicePrice"
                      value={editServicePrice}
                      onChange={(e) => setEditServicePrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editServiceCategory" className="form-label">Categoría</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editServiceCategory"
                      value={editServiceCategory}
                      onChange={(e) => setEditServiceCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editServiceImage" className="form-label">Imagen</label>
                    <input
                      type="file"
                      className="form-control"
                      id="editServiceImage"
                      onChange={(e) => setEditServiceImage(e.target.files[0])}
                    />
                    {editingService.image && (
                      <div className="mt-2">
                        <p>Imagen actual:</p>
                        <img src={editingService.image} alt="Current Service" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
                      </div>
                    )}
                  </div>
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowEditModal(false)}>Cancelar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminServices;