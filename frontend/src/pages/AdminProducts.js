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

  const [filterNombre, setFilterNombre] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('');

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    sku: '',
    stock: '',
    categoria: '',
    especificaciones: '{}',
    image: null,
  });

  const fetchProducts = useCallback(async () => {
    const res = await authenticatedFetch('/products');
    const data = await res.json();
    setProducts(data);
    setFilteredProducts(data);
  }, []);

  const fetchCategories = useCallback(async () => {
    const res = await authenticatedFetch('/categories');
    const data = await res.json();
    setCategories(data);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      setError('No tienes permisos');
      setLoading(false);
      return;
    }

    Promise.all([fetchProducts(), fetchCategories()])
      .catch(() => setError('Error cargando datos'))
      .finally(() => setLoading(false));
  }, [user, fetchProducts, fetchCategories]);

  useEffect(() => {
    let temp = [...products];
    if (filterNombre)
      temp = temp.filter(p =>
        p.nombre.toLowerCase().includes(filterNombre.toLowerCase())
      );
    if (filterCategoria)
      temp = temp.filter(p => p.categoria?._id === filterCategoria);
    setFilteredProducts(temp);
  }, [filterNombre, filterCategoria, products]);

  const handleChange = e => {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => v && fd.append(k, v));

    const url = editingProduct
      ? `/products/${editingProduct._id}`
      : '/products';

    const method = editingProduct ? 'PUT' : 'POST';

    const res = await authenticatedFetch(url, { method, body: fd });

    if (res.ok) {
      fetchProducts();
      setShowCreateModal(false);
      setShowEditModal(false);
    } else {
      alert('Error guardando producto');
    }
  };

  const handleDelete = async id => {
    if (!window.confirm('¿Eliminar producto?')) return;
    await authenticatedFetch(`/products/${id}`, { method: 'DELETE' });
    fetchProducts();
  };

  const handleExport = async () => {
    const res = await authenticatedFetch('/products/export');
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'productos.xlsx';
    a.click();
    URL.revokeObjectURL(url);
  };

  if (loading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">Gestión de Productos</h2>

      <div className="flex gap-2 mb-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
          onClick={() => {
            setForm({});
            setEditingProduct(null);
            setShowCreateModal(true);
          }}
        >
          Crear Producto
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded"
          onClick={handleExport}
        >
          Exportar XLSX
        </button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          className="border p-2 rounded"
          placeholder="Buscar por nombre"
          value={filterNombre}
          onChange={e => setFilterNombre(e.target.value)}
        />
        <select
          className="border p-2 rounded"
          value={filterCategoria}
          onChange={e => setFilterCategoria(e.target.value)}
        >
          <option value="">Todas las categorías</option>
          {categories.map(c => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full bg-white shadow rounded">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Nombre</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Stock</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p._id} className="border-t">
                <td className="p-3">{p.nombre}</td>
                <td>{p.categoria?.name}</td>
                <td>Bs {p.precio?.toFixed(2)}</td>
                <td>{p.stock}</td>
                <td className="space-x-2">
                  <button
                    className="text-blue-600"
                    onClick={() => {
                      setEditingProduct(p);
                      setForm({ ...p, categoria: p.categoria?._id });
                      setShowEditModal(true);
                    }}
                  >
                    Editar
                  </button>
                  <button
                    className="text-red-600"
                    onClick={() => handleDelete(p._id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            onSubmit={handleSubmit}
            className="bg-white p-6 rounded w-full max-w-xl"
          >
            <h3 className="text-xl font-bold mb-4">
              {editingProduct ? 'Editar' : 'Crear'} Producto
            </h3>

            {['nombre', 'descripcion', 'precio', 'sku', 'stock'].map(f => (
              <input
                key={f}
                name={f}
                placeholder={f}
                className="w-full border p-2 rounded mb-3"
                value={form[f] || ''}
                onChange={handleChange}
              />
            ))}

            <select
              name="categoria"
              className="w-full border p-2 rounded mb-3"
              value={form.categoria || ''}
              onChange={handleChange}
            >
              <option value="">Seleccione categoría</option>
              {categories.map(c => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>

            <textarea
              name="especificaciones"
              className="w-full border p-2 rounded mb-3"
              placeholder="Especificaciones JSON"
              value={form.especificaciones || ''}
              onChange={handleChange}
            />

            <input
              type="file"
              name="image"
              className="mb-4"
              onChange={handleChange}
            />

            <div className="flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => {
                  setShowCreateModal(false);
                  setShowEditModal(false);
                }}
              >
                Cancelar
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded">
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
