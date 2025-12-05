import React, { useEffect, useState } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminPanel = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Create User form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUserRole, setNewUserRole] = useState('cliente'); // Default role

  // State for Create User Modal visibility
  const [showCreateModal, setShowCreateModal] = useState(false);

  // State for Edit User modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editUserName, setEditUserName] = useState('');
  const [editUserEmail, setEditUserEmail] = useState('');
  const [editUserRole, setEditUserRole] = useState('');

  const fetchUsers = async () => {
    if (user && user.role === 'admin') {
      try {
        const response = await authenticatedFetch('/users'); // Call the new backend route
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar usuarios');
        }
      } catch (err) {
        console.error('Error fetching users:', err);
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
      setError('No tienes permisos para ver esta página.');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [user]);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await authenticatedFetch('/users', {
        method: 'POST',
        body: JSON.stringify({
          name: newUserName,
          email: newUserEmail,
          password: newUserPassword,
          role: newUserRole,
        }),
      });

      if (response.ok) {
        alert('Usuario creado exitosamente');
        setNewUserName('');
        setNewUserEmail('');
        setNewUserPassword('');
        setNewUserRole('cliente');
        setShowCreateModal(false); // Close the modal
        fetchUsers(); // Refresh user list
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al crear usuario');
      }
    } catch (err) {
      console.error('Error creating user:', err);
      alert('Error de conexión al servidor');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      try {
        const response = await authenticatedFetch(`/users/${userId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Usuario eliminado exitosamente');
          fetchUsers(); // Refresh user list
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Error al eliminar usuario');
        }
      } catch (err) {
        console.error('Error deleting user:', err);
        alert('Error de conexión al servidor');
      }
    }
  };

  const handleEditClick = (userToEdit) => {
    setEditingUser(userToEdit);
    setEditUserName(userToEdit.name);
    setEditUserEmail(userToEdit.email);
    setEditUserRole(userToEdit.role);
    setShowEditModal(true);
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await authenticatedFetch(`/users/${editingUser._id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: editUserName,
          email: editUserEmail,
          role: editUserRole,
        }),
      });

      if (response.ok) {
        alert('Usuario actualizado exitosamente');
        setShowEditModal(false);
        setEditingUser(null);
        fetchUsers(); // Refresh user list
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al actualizar usuario');
      }
    } catch (err) {
      console.error('Error updating user:', err);
      alert('Error de conexión al servidor');
    }
  };

  if (loading) {
    return <div className="container mt-5">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Panel de Administración</h2>

      {/* Button to open Create User Modal */}
      <button className="btn btn-primary mb-4" onClick={() => setShowCreateModal(true)}>
        Crear Nuevo Usuario
      </button>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Nuevo Usuario</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateUser}>
                  <div className="mb-3">
                    <label htmlFor="newUserName" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="newUserName"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newUserEmail" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="newUserEmail"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newUserPassword" className="form-label">Contraseña</label>
                    <input
                      type="password"
                      className="form-control"
                      id="newUserPassword"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newUserRole" className="form-label">Rol</label>
                    <select
                      className="form-select"
                      id="newUserRole"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <button type="submit" className="btn btn-success">Crear Usuario</button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User List Table */}
      <h3>Gestión de Usuarios Existentes</h3>
      {users.length === 0 ? (
        <p>No hay usuarios registrados.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Email</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u._id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditClick(u)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteUser(u._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Usuario</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateUser}>
                  <div className="mb-3">
                    <label htmlFor="editUserName" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editUserName"
                      value={editUserName}
                      onChange={(e) => setEditUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editUserEmail" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="editUserEmail"
                      value={editUserEmail}
                      onChange={(e) => setEditUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editUserRole" className="form-label">Rol</label>
                    <select
                      className="form-select"
                      id="editUserRole"
                      value={editUserRole}
                      onChange={(e) => setEditUserRole(e.target.value)}
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Admin</option>
                    </select>
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

export default AdminPanel;