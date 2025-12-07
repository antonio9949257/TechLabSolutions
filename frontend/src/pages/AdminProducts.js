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
    return <div className="container mt-5">Cargando productos...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Gestión de Productos</h2>

      {/* Button to open Create Product Modal */}
      <button className="btn btn-primary mb-4" onClick={() => setShowCreateModal(true)}>
        Crear Nuevo Producto
      </button>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Crear Nuevo Producto</h5>
                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleCreateProduct}>
                  <div className="mb-3">
                    <label htmlFor="newProductName" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="newProductName"
                      value={newProductName}
                      onChange={(e) => setNewProductName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newProductDescription" className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      id="newProductDescription"
                      value={newProductDescription}
                      onChange={(e) => setNewProductDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newProductPrice" className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      id="newProductPrice"
                      value={newProductPrice}
                      onChange={(e) => setNewProductPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newProductSku" className="form-label">SKU</label>
                    <input
                      type="text"
                      className="form-control"
                      id="newProductSku"
                      value={newProductSku}
                      onChange={(e) => setNewProductSku(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newProductStock" className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      id="newProductStock"
                      value={newProductStock}
                      onChange={(e) => setNewProductStock(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newProductCategory" className="form-label">Categoría</label>
                    <input
                      type="text"
                      className="form-control"
                      id="newProductCategory"
                      value={newProductCategory}
                      onChange={(e) => setNewProductCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="newProductImage" className="form-label">Imagen</label>
                    <input
                      type="file"
                      className="form-control"
                      id="newProductImage"
                      onChange={(e) => setNewProductImage(e.target.files[0])}
                    />
                  </div>
                  <button type="submit" className="btn btn-success">Crear Producto</button>
                  <button type="button" className="btn btn-secondary ms-2" onClick={() => setShowCreateModal(false)}>Cancelar</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Product List Table */}
      <h3>Productos Existentes</h3>
      {products.length === 0 ? (
        <p>No hay productos registrados.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>SKU</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.image && (
                    <img src={p.image} alt={p.name} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />
                  )}
                </td>
                <td>{p.name}</td>
                <td>{p.category}</td>
                <td>${p.price.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td>{p.sku}</td>
                <td>
                  <button
                    className="btn btn-warning btn-sm me-2"
                    onClick={() => handleEditClick(p)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleDeleteProduct(p._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="modal show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Producto</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdateProduct}>
                  <div className="mb-3">
                    <label htmlFor="editProductName" className="form-label">Nombre</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editProductName"
                      value={editProductName}
                      onChange={(e) => setEditProductName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editProductDescription" className="form-label">Descripción</label>
                    <textarea
                      className="form-control"
                      id="editProductDescription"
                      value={editProductDescription}
                      onChange={(e) => setEditProductDescription(e.target.value)}
                      required
                    ></textarea>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editProductPrice" className="form-label">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      id="editProductPrice"
                      value={editProductPrice}
                      onChange={(e) => setEditProductPrice(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editProductSku" className="form-label">SKU</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editProductSku"
                      value={editProductSku}
                      onChange={(e) => setEditProductSku(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editProductStock" className="form-label">Stock</label>
                    <input
                      type="number"
                      className="form-control"
                      id="editProductStock"
                      value={editProductStock}
                      onChange={(e) => setEditProductStock(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editProductCategory" className="form-label">Categoría</label>
                    <input
                      type="text"
                      className="form-control"
                      id="editProductCategory"
                      value={editProductCategory}
                      onChange={(e) => setEditProductCategory(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="editProductImage" className="form-label">Imagen</label>
                    <input
                      type="file"
                      className="form-control"
                      id="editProductImage"
                      onChange={(e) => setEditProductImage(e.target.files[0])}
                    />
                    {editingProduct.image && (
                      <div className="mt-2">
                        <p>Imagen actual:</p>
                        <img src={editingProduct.image} alt="Current Product" style={{ width: '100px', height: '100px', objectFit: 'cover' }} />
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

export default AdminProducts;
