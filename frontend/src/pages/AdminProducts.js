import React, { useEffect, useState, useCallback } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [filterNombre, setFilterNombre] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');

  // Create Product form states
  const [newProductNombre, setNewProductNombre] = useState('');
  const [newProductDescripcion, setNewProductDescripcion] = useState('');
  const [newProductPrecio, setNewProductPrecio] = useState('');
  const [newProductSku, setNewProductSku] = useState('');
  const [newProductStock, setNewProductStock] = useState('');
  const [newProductCategoria, setNewProductCategoria] = useState('');
  const [newProductEspecificaciones, setNewProductEspecificaciones] = useState('{}');
  const [newProductImage, setNewProductImage] = useState(null);

  // Edit Product modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editProductNombre, setEditProductNombre] = useState('');
  const [editProductDescripcion, setEditProductDescripcion] = useState('');
  const [editProductPrecio, setEditProductPrecio] = useState('');
  const [editProductSku, setEditProductSku] = useState('');
  const [editProductStock, setEditProductStock] = useState('');
  const [editProductCategoria, setEditProductCategoria] = useState('');
  const [editProductEspecificaciones, setEditProductEspecificaciones] = useState('{}');
  const [editProductImage, setEditProductImage] = useState(null);

  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await authenticatedFetch('/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data);
        setFilteredProducts(data); // Initialize filtered list
      } else {
        setError('Error al cargar productos');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    try {
      const response = await authenticatedFetch('/categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
        if (data.length > 0 && !newProductCategoria) {
          setNewProductCategoria(data[0]._id);
        }
      } else {
        setError('Error al cargar categorías');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  }, [newProductCategoria]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProducts(), fetchCategories()]);
      setLoading(false);
    };
    if (user && user.role === 'admin') {
      loadData();
    } else {
      setError('No tienes permisos para ver esta página.');
      setLoading(false);
    }
  }, [user, fetchProducts, fetchCategories]);

  // Effect for filtering
  useEffect(() => {
    let tempProducts = [...products];
    if (filterNombre) {
      tempProducts = tempProducts.filter(p =>
        p.nombre.toLowerCase().includes(filterNombre.toLowerCase())
      );
    }
    if (filterCategoria) {
      tempProducts = tempProducts.filter(p => p.categoria?._id === filterCategoria);
    }
    setFilteredProducts(tempProducts);
  }, [products, filterNombre, filterCategoria]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', newProductNombre);
    formData.append('descripcion', newProductDescripcion);
    formData.append('precio', newProductPrecio);
    formData.append('sku', newProductSku);
    formData.append('stock', newProductStock);
    formData.append('categoria', newProductCategoria);
    formData.append('especificaciones', newProductEspecificaciones);
    if (newProductImage) formData.append('image', newProductImage);

    try {
      const response = await authenticatedFetch('/products', { method: 'POST', body: formData });
      if (response.ok) {
        alert('Producto creado exitosamente');
        setShowCreateModal(false);
        fetchProducts(); // Refreshes the products list
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al crear producto');
      }
    } catch (err) {
      alert('Error de conexión al servidor');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      try {
        const response = await authenticatedFetch(`/products/${productId}`, { method: 'DELETE' });
        if (response.ok) {
          alert('Producto eliminado exitosamente');
          fetchProducts();
        } else {
          alert('Error al eliminar producto');
        }
      } catch (err) {
        alert('Error de conexión al servidor');
      }
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setEditProductNombre(product.nombre);
    setEditProductDescripcion(product.descripcion);
    setEditProductPrecio(product.precio);
    setEditProductSku(product.sku);
    setEditProductStock(product.stock);
    setEditProductCategoria(product.categoria?._id || '');
    setEditProductEspecificaciones(JSON.stringify(product.especificaciones, null, 2));
    setEditProductImage(null);
    setShowEditModal(true);
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('nombre', editProductNombre);
    formData.append('descripcion', editProductDescripcion);
    formData.append('precio', editProductPrecio);
    formData.append('sku', editProductSku);
    formData.append('stock', editProductStock);
    formData.append('categoria', editProductCategoria);
    formData.append('especificaciones', editProductEspecificaciones);
    if (editProductImage) formData.append('image', editProductImage);

    try {
      const response = await authenticatedFetch(`/products/${editingProduct._id}`, { method: 'PUT', body: formData });
      if (response.ok) {
        alert('Producto actualizado exitosamente');
        setShowEditModal(false);
        fetchProducts();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error al actualizar producto');
      }
    } catch (err) {
      alert('Error de conexión al servidor');
    }
  };

  const handleExport = async () => {
    try {
      const response = await authenticatedFetch('/products/export');
      if (!response.ok) {
        throw new Error('Error al exportar los datos');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'productos.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Error exporting products:', err);
      alert('No se pudo exportar la lista de productos.');
    }
  };

  if (loading) return <div className="container mt-5">Cargando...</div>;
  if (error) return <div className="container mt-5 text-danger">Error: {error}</div>;

  return (
    <div className="container mt-5">
      <h2>Gestión de Productos</h2>
      <div className="d-flex gap-2 mb-4">
        <button className="btn btn-primary" onClick={() => setShowCreateModal(true)}>Crear Nuevo Producto</button>
        <button className="btn btn-success" onClick={handleExport}>Exportar a XLSX</button>
      </div>

      {/* Create Product Modal */}
      {showCreateModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleCreateProduct}>
                <div className="modal-header"><h5 className="modal-title">Crear Producto</h5><button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button></div>
                <div className="modal-body">
                  <div className="mb-3"><label className="form-label">Nombre</label><input type="text" className="form-control" value={newProductNombre} onChange={(e) => setNewProductNombre(e.target.value)} required /></div>
                  <div className="mb-3"><label className="form-label">Descripción</label><textarea className="form-control" value={newProductDescripcion} onChange={(e) => setNewProductDescripcion(e.target.value)} required></textarea></div>
                  <div className="row">
                    <div className="col-md-6 mb-3"><label className="form-label">Precio</label><input type="number" step="0.01" className="form-control" value={newProductPrecio} onChange={(e) => setNewProductPrecio(e.target.value)} required /></div>
                    <div className="col-md-6 mb-3"><label className="form-label">SKU</label><input type="text" className="form-control" value={newProductSku} onChange={(e) => setNewProductSku(e.target.value)} required /></div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3"><label className="form-label">Stock</label><input type="number" className="form-control" value={newProductStock} onChange={(e) => setNewProductStock(e.target.value)} required /></div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Categoría</label>
                      <select className="form-select" value={newProductCategoria} onChange={(e) => setNewProductCategoria(e.target.value)} required>
                        <option value="" disabled>Seleccione una categoría</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3"><label className="form-label">Especificaciones (JSON)</label><textarea className="form-control" rows="3" value={newProductEspecificaciones} onChange={(e) => setNewProductEspecificaciones(e.target.value)}></textarea></div>
                  <div className="mb-3"><label className="form-label">Imagen</label><input type="file" className="form-control" onChange={(e) => setNewProductImage(e.target.files[0])} /></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)}>Cancelar</button><button type="submit" className="btn btn-success">Crear</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      <h3>Productos Existentes</h3>
      
      {/* Filter UI */}
      <div className="row mb-4">
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={filterNombre}
            onChange={(e) => setFilterNombre(e.target.value)}
          />
        </div>
        <div className="col-md-6">
          <select
            className="form-select"
            value={filterCategoria}
            onChange={(e) => setFilterCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="table table-striped">
          <thead><tr><th>Imagen</th><th>Nombre</th><th>Categoría</th><th>Precio</th><th>Stock</th><th>SKU</th><th>Acciones</th></tr></thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id}>
                <td>{p.img_url && <img src={p.img_url} alt={p.nombre} style={{ width: '50px', height: '50px', objectFit: 'cover' }} />}</td>
                <td>{p.nombre}</td>
                <td>{p.categoria?.name || 'Sin categoría'}</td>
                <td>Bs {p.precio ? parseFloat(p.precio.toFixed(2)) : '0.00'}</td>
                <td>{p.stock}</td>
                <td>{p.sku}</td>
                <td>
                  <button className="btn btn-warning btn-sm me-2" onClick={() => handleEditClick(p)}>Editar</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p._id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      {showEditModal && editingProduct && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleUpdateProduct}>
                <div className="modal-header"><h5 className="modal-title">Editar Producto</h5><button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button></div>
                <div className="modal-body">
                  <div className="mb-3"><label className="form-label">Nombre</label><input type="text" className="form-control" value={editProductNombre} onChange={(e) => setEditProductNombre(e.target.value)} required /></div>
                  <div className="mb-3"><label className="form-label">Descripción</label><textarea className="form-control" value={editProductDescripcion} onChange={(e) => setEditProductDescripcion(e.target.value)} required></textarea></div>
                  <div className="row">
                    <div className="col-md-6 mb-3"><label className="form-label">Precio</label><input type="number" step="0.01" className="form-control" value={editProductPrecio} onChange={(e) => setEditProductPrecio(e.target.value)} required /></div>
                    <div className="col-md-6 mb-3"><label className="form-label">SKU</label><input type="text" className="form-control" value={editProductSku} onChange={(e) => setEditProductSku(e.target.value)} required /></div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3"><label className="form-label">Stock</label><input type="number" className="form-control" value={editProductStock} onChange={(e) => setEditProductStock(e.target.value)} required /></div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Categoría</label>
                      <select className="form-select" value={editProductCategoria} onChange={(e) => setEditProductCategoria(e.target.value)} required>
                        <option value="" disabled>Seleccione una categoría</option>
                        {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="mb-3"><label className="form-label">Especificaciones (JSON)</label><textarea className="form-control" rows="3" value={editProductEspecificaciones} onChange={(e) => setEditProductEspecificaciones(e.target.value)}></textarea></div>
                  <div className="mb-3">
                    <label className="form-label">Nueva Imagen</label>
                    <input type="file" className="form-control" onChange={(e) => setEditProductImage(e.target.files[0])} />
                    {editingProduct.img_url && !editProductImage && <div className="mt-2"><p>Imagen actual:</p><img src={editingProduct.img_url} alt="Current" style={{ width: '100px', height: '100px', objectFit: 'cover' }} /></div>}
                  </div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancelar</button><button type="submit" className="btn btn-primary">Guardar Cambios</button></div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
