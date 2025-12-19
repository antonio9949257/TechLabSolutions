import React, { useEffect, useState, useCallback } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for Create Product form
  const [newProductName, setNewProductName] = useState('');
  const [newProductDescription, setNewProductDescription] = useState('');
  const [newProductPrice, setNewProductPrice] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('');
  const [newProductImage, setNewProductImage] = useState(null); // For file input

  // State for Edit Product modal
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductName, setEditProductName] = useState('');
  const [editProductDescription, setEditProductDescription] = useState('');
  const [editProductPrice, setEditProductPrice] = useState('');
  const [editProductSku, setEditProductSku] = useState('');
  const [editProductStock, setEditProductStock] = useState('');
  const [editProductCategory, setEditProductCategory] = useState('');
  const [editProductImage, setEditProductImage] = useState(null); // For file input

  // State for Create Product Modal visibility
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchProducts = useCallback(async () => {
    if (user && user.role === 'admin') {
      try {
        const response = await authenticatedFetch('/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar productos');
        }
      } catch (err) {
        console.error('Error fetching products:', err);
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
    fetchProducts();
  }, [fetchProducts]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newProductName);
    formData.append('description', newProductDescription);
    formData.append('price', newProductPrice);
    formData.append('sku', newProductSku);
    formData.append('stock', newProductStock);
    formData.append('category', newProductCategory);
    if (newProductImage) {
      formData.append('image', newProductImage);
    }

    try {
      const response = await authenticatedFetch('/products', {
        method: 'POST',
        body: formData, // FormData is used for file uploads
        // Do NOT set Content-Type header for FormData, browser sets it automatically
      });

      if (response.ok) {
        alert('Producto creado exitosamente');
        setNewProductName('');
        setNewProductDescription('');
        setNewProductPrice('');
        setNewProductSku('');
        setNewProductStock('');
        setNewProductCategory('');
        setNewProductImage(null);
        fetchProducts(); // Refresh product list
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al crear producto');
      }
    } catch (err) {
      console.error('Error creating product:', err);
      alert('Error de conexión al servidor');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await authenticatedFetch(`/products/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          alert('Producto eliminado exitosamente');
          fetchProducts(); // Refresh product list
        } else {
          const errorData = await response.json();
          alert(errorData.message || 'Error al eliminar producto');
        }
      } catch (err) {
        console.error('Error deleting product:', err);
        alert('Error de conexión al servidor');
      }
    }
  };

  const handleEditClick = (productToEdit) => {
    setEditingProduct(productToEdit);
    setEditProductName(productToEdit.name);
    setEditProductDescription(productToEdit.description);
    setEditProductPrice(productToEdit.price);
    setEditProductSku(productToEdit.sku);
    setEditProductStock(productToEdit.stock);
    setEditProductCategory(productToEdit.category);
    setEditProductImage(null); // Clear previous image selection
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', editProductName);
    formData.append('description', editProductDescription);
    formData.append('price', editProductPrice);
    formData.append('sku', editProductSku);
    formData.append('stock', editProductStock);
    formData.append('category', editProductCategory);
    if (editProductImage) {
      formData.append('image', editProductImage);
    }

    try {
      const response = await authenticatedFetch(`/products/${editingProduct._id}`, {
        method: 'PUT',
        body: formData,
        // Do NOT set Content-Type header for FormData
      });

      if (response.ok) {
        alert('Producto actualizado exitosamente');
        setShowEditModal(false);
        setEditingProduct(null);
        fetchProducts(); // Refresh product list
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al actualizar producto');
      }
    } catch (err) {
      console.error('Error updating product:', err);
      alert('Error de conexión al servidor');
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 mt-8">Cargando productos...</div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 mt-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Gestión de Productos</h2>

      {/* Button to open Create Product Modal */}
      <button className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300 mb-6" onClick={() => setShowCreateModal(true)}>
        Crear Nuevo Producto
      </button>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h5 className="text-xl font-bold">Crear Nuevo Producto</h5>
              <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => setShowCreateModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="py-4">
              <form onSubmit={handleCreateProduct}>
                <div className="mb-4">
                  <label htmlFor="newProductName" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newProductName"
                    value={newProductName}
                    onChange={(e) => setNewProductName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newProductDescription" className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newProductDescription"
                    value={newProductDescription}
                    onChange={(e) => setNewProductDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="newProductPrice" className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newProductPrice"
                    value={newProductPrice}
                    onChange={(e) => setNewProductPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newProductSku" className="block text-gray-700 text-sm font-bold mb-2">SKU</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newProductSku"
                    value={newProductSku}
                    onChange={(e) => setNewProductSku(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newProductStock" className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newProductStock"
                    value={newProductStock}
                    onChange={(e) => setNewProductStock(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="newProductCategory" className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newProductCategory"
                    value={newProductCategory}
                    onChange={(e) => setNewProductCategory(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="newProductImage" className="block text-gray-700 text-sm font-bold mb-2">Imagen</label>
                  <input
                    type="file"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="newProductImage"
                    onChange={(e) => setNewProductImage(e.target.files[0])}
                  />
                </div>
                <div className="flex justify-end">
                  <button type="submit" className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">Crear Producto</button>
                  <button type="button" className="bg-gray-300 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-400 transition duration-300 ml-2" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Product List Table */}
      <h3 className="text-2xl font-bold mb-4">Productos Existentes</h3>
      {products.length === 0 ? (
        <p className="text-gray-600">No hay productos registrados.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse bg-white shadow-md rounded-lg">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Imagen</th>
                <th className="py-3 px-4 text-left font-semibold">Nombre</th>
                <th className="py-3 px-4 text-left font-semibold">Categoría</th>
                <th className="py-3 px-4 text-left font-semibold">Precio</th>
                <th className="py-3 px-4 text-left font-semibold">Stock</th>
                <th className="py-3 px-4 text-left font-semibold">SKU</th>
                <th className="py-3 px-4 text-left font-semibold">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p._id} className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {p.image && (
                      <img src={p.image} alt={p.name} className="w-12 h-12 object-cover rounded-md" />
                    )}
                  </td>
                  <td className="py-3 px-4">{p.name}</td>
                  <td className="py-3 px-4">{p.category}</td>
                  <td className="py-3 px-4">${p.price.toFixed(2)}</td>
                  <td className="py-3 px-4">{p.stock}</td>
                  <td className="py-3 px-4">{p.sku}</td>
                  <td className="py-3 px-4">
                    <button
                      className="bg-yellow-500 text-white py-1 px-3 rounded-md hover:bg-yellow-600 transition duration-300 text-sm mr-2"
                      onClick={() => handleEditClick(p)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition duration-300 text-sm"
                      onClick={() => handleDeleteProduct(p._id)}
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
      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-auto">
            <div className="flex justify-between items-center pb-3 border-b border-gray-200">
              <h5 className="text-xl font-bold">Editar Producto</h5>
              <button type="button" className="text-gray-400 hover:text-gray-600" onClick={() => setShowEditModal(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="py-4">
              <form onSubmit={handleUpdateProduct}>
                <div className="mb-4">
                  <label htmlFor="editProductName" className="block text-gray-700 text-sm font-bold mb-2">Nombre</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editProductName"
                    value={editProductName}
                    onChange={(e) => setEditProductName(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editProductDescription" className="block text-gray-700 text-sm font-bold mb-2">Descripción</label>
                  <textarea
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editProductDescription"
                    value={editProductDescription}
                    onChange={(e) => setEditProductDescription(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="mb-4">
                  <label htmlFor="editProductPrice" className="block text-gray-700 text-sm font-bold mb-2">Precio</label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editProductPrice"
                    value={editProductPrice}
                    onChange={(e) => setEditProductPrice(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editProductSku" className="block text-gray-700 text-sm font-bold mb-2">SKU</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editProductSku"
                    value={editProductSku}
                    onChange={(e) => setEditProductSku(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editProductStock" className="block text-gray-700 text-sm font-bold mb-2">Stock</label>
                  <input
                    type="number"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editProductStock"
                    value={editProductStock}
                    onChange={(e) => setEditProductStock(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="editProductCategory" className="block text-gray-700 text-sm font-bold mb-2">Categoría</label>
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editProductCategory"
                    value={editProductCategory}
                    onChange={(e) => setEditProductCategory(e.target.value)}
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="editProductImage" className="block text-gray-700 text-sm font-bold mb-2">Imagen</label>
                  <input
                    type="file"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="editProductImage"
                    onChange={(e) => setEditProductImage(e.target.files[0])}
                  />
                  {editingProduct.image && (
                    <div className="mt-4">
                      <p className="text-gray-700 mb-2">Imagen actual:</p>
                      <img src={editingProduct.image} alt="Current Product" className="w-24 h-24 object-cover rounded-md" />
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

export default AdminProducts;
