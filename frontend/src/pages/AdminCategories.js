import React, { useState, useEffect, useCallback } from 'react';
import { authenticatedFetch } from '../utils/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryDescription, setNewCategoryDescription] = useState('');

  const [showEditModal, setShowEditModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editCategoryDescription, setEditCategoryDescription] = useState('');

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await authenticatedFetch('/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        setError('Error al cargar categorías');
      }
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await authenticatedFetch('/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName, description: newCategoryDescription }),
      });
      if (response.ok) {
        setShowCreateModal(false);
        setNewCategoryName('');
        setNewCategoryDescription('');
        fetchCategories();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al crear');
      }
    } catch (err) {
      alert('Error de conexión al crear.');
    }
  };

  const handleEditClick = (category) => {
    setEditingCategory(category);
    setEditCategoryName(category.name);
    setEditCategoryDescription(category.description || '');
    setShowEditModal(true);
  };

  const handleUpdateCategory = async (e) => {
    e.preventDefault();
    try {
      const response = await authenticatedFetch(`/categories/${editingCategory._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editCategoryName, description: editCategoryDescription }),
      });
      if (response.ok) {
        setShowEditModal(false);
        setEditingCategory(null);
        fetchCategories();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al actualizar');
      }
    } catch (err) {
      alert('Error de conexión al actualizar.');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('¿Seguro que quieres eliminar esta categoría?')) {
      try {
        const response = await authenticatedFetch(`/categories/${categoryId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          fetchCategories();
        } else {
          alert('Error al eliminar');
        }
      } catch (err) {
        alert('Error de conexión al eliminar.');
      }
    }
  };

  if (loading) return <p>Cargando categorías...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-5">
      <h2>Gestión de Categorías</h2>
      <button className="btn btn-primary mb-4" onClick={() => setShowCreateModal(true)}>
        Crear Nueva Categoría
      </button>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleCreateCategory}>
                <div className="modal-header">
                  <h5 className="modal-title">Nueva Categoría</h5>
                  <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" value={newCategoryDescription} onChange={(e) => setNewCategoryDescription(e.target.value)}></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Crear</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && editingCategory && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUpdateCategory}>
                <div className="modal-header">
                  <h5 className="modal-title">Editar Categoría</h5>
                  <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre</label>
                    <input type="text" className="form-control" value={editCategoryName} onChange={(e) => setEditCategoryName(e.target.value)} required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Descripción</label>
                    <textarea className="form-control" value={editCategoryDescription} onChange={(e) => setEditCategoryDescription(e.target.value)}></textarea>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Guardar Cambios</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td>{cat.name}</td>
              <td>{cat.description}</td>
              <td>
                <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(cat)}>Editar</button>
                <button className="btn btn-danger btn-sm" onClick={() => handleDeleteCategory(cat._id)}>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminCategories;
