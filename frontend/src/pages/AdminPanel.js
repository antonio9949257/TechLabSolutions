import React, { useEffect, useState, useCallback } from 'react';
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

  const fetchUsers = useCallback(async () => {
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
  }, [user]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
    return <div className="container mx-auto px-4 mt-8">Cargando usuarios...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 mt-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Panel de Administración</h2>

      {/* Button to open Create User Modal */}
      <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-6" onClick={() => setShowCreateModal(true)}>
        Crear Nuevo Usuario
      </button>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h5 className="text-xl font-bold">Crear Nuevo Usuario</h5>
              <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => setShowCreateModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="py-4">
                <form onSubmit={handleCreateUser}>
                  <div className="mb-4">
                    <label htmlFor="newUserName" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                    <input
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="newUserName"
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="newUserEmail" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                      type="email"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="newUserEmail"
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label htmlFor="newUserPassword" className="block text-gray-700 text-sm font-bold mb-2">Contraseña</label>
                    <input
                      type="password"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="newUserPassword"
                      value={newUserPassword}
                      onChange={(e) => setNewUserPassword(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label htmlFor="newUserRole" className="block text-gray-700 text-sm font-bold mb-2">Rol</label>
                    <select
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      id="newUserRole"
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                    >
                      <option value="cliente">Cliente</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex justify-end">
                    <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">Crear Usuario</button>
                    <button type="button" className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 ml-2" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                  </div>
                </form>
            </div>
          </div>
        </div>
      )}

      {/* User List Table */}
      <h3 className="text-2xl font-bold mb-4">Gestión de Usuarios Existentes</h3>
      {users.length === 0 ? (
        <p className="text-gray-600">No hay usuarios registrados.</p>
      ) : (
        <div className="overflow-x-auto"> {/* Added for responsive table */}
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">ID</th>
                <th className="py-3 px-4 text-left font-semibold">Nombre</th>
                <th className="py-3 px-4 text-left font-semibold">Email</th>
                <th className="py-3 px-4 text-left font-semibold">Rol</th>
                <th className="py-3 px-4 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">{u._id}</td>
                  <td className="py-3 px-4">{u.name}</td>
                  <td className="py-3 px-4">{u.email}</td>
                  <td className="py-3 px-4">{u.role}</td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-300 text-sm mr-2"
                      onClick={() => handleEditClick(u)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition duration-300 text-sm"
                      onClick={() => handleDeleteUser(u._id)}
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

      {/* Edit User Modal */}
      {showEditModal && editingUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg mx-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h5 className="text-xl font-bold">Editar Usuario</h5>
              <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => setShowEditModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="py-4">
              <form onSubmit={handleUpdateUser}>
                <div className="mb-4">
                  <label htmlFor="editUserName" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editUserName"
                    value={editUserName}
                    onChange={(e) => setEditUserName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editUserEmail" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                  <input
                    type="email"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editUserEmail"
                    value={editUserEmail}
                    onChange={(e) => setEditUserEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="editUserRole" className="block text-gray-700 text-sm font-bold mb-2">Rol</label>
                  <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editUserRole"
                    value={editUserRole}
                    onChange={(e) => setEditUserRole(e.target.value)}
                  >
                    <option value="cliente">Cliente</option>
                    <option value="admin">Admin</option>
                  </select>
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

export default AdminPanel;