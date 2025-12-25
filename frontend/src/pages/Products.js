import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const categories = [
  'Todos',
  'Cámaras de Seguridad',
  'Cámaras IP',
  'Cámaras WiFi',
  'Cámaras PTZ',
  'Kits de Vigilancia',
  'DVR / NVR',
  'Alarmas',
  'Sensores de Movimiento',
  'Video Porteros',
  'Control de Acceso',
  'Accesorios'
];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { addToCart } = useCart();
  const { user, openLoginModal } = useAuth();

  useEffect(() => {
    const fetchProducts = async () => {
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
    };
    fetchProducts();
  }, []);

  const handleAddToCart = (productId) => {
    addToCart(productId, 1, 'Product');
  };

  const filterProducts = (products, category) => {
    switch (category) {
      case 'Todos':
        return products;
      case 'Cámaras de Seguridad':
        return products.filter(p => p.categoria?.name === 'Cámaras CCTV');
      case 'Cámaras IP':
        return products.filter(p => p.categoria?.name === 'Cámaras CCTV' && p.nombre.toLowerCase().includes('ip'));
      case 'Cámaras WiFi':
        return products.filter(p => p.categoria?.name === 'Cámaras CCTV' && p.nombre.toLowerCase().includes('wifi'));
      case 'Cámaras PTZ':
        return products.filter(p => p.categoria?.name === 'Cámaras CCTV' && p.nombre.toLowerCase().includes('ptz'));
      case 'DVR / NVR':
        return products.filter(p => p.categoria?.name === 'Grabadores CCTV');
      case 'Accesorios':
        const accessoryCategories = [
          'Accesorios CCTV',
          'Energía y Fuentes',
          'Cableado',
          'Canalización y Montaje',
          'Protección Eléctrica'
        ];
        return products.filter(p => accessoryCategories.includes(p.categoria?.name));
      case 'Kits de Vigilancia':
      case 'Alarmas':
      case 'Sensores de Movimiento':
      case 'Video Porteros':
      case 'Control de Acceso':
        return []; // No products for these categories yet
      default:
        return [];
    }
  };

  const filteredProducts = filterProducts(products, selectedCategory);

  if (loading) return <div className="container mx-auto px-4 mt-8">Cargando productos...</div>;
  if (error) return <div className="container mx-auto px-4 mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 flex">
      {/* Category Sidebar */}
      <aside className="w-1/4 pr-8">
        <h3 className="text-xl font-bold mb-4">Categorías</h3>
        <ul className="space-y-2">
          {categories.map(category => (
            <li key={category}>
              <button
                onClick={() => setSelectedCategory(category)}
                className={`w-full text-left px-4 py-2 rounded-md transition duration-200 ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category}
              </button>
            </li>
          ))}
        </ul>
      </aside>

      {/* Products Grid */}
      <main className="w-3/4">
        <h2 className="text-3xl font-bold mb-6">Nuestros Productos</h2>
        {filteredProducts.length === 0 ? (
          <p className="text-secondary">No hay productos disponibles en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <div key={product._id} className="bg-card-bg rounded-lg shadow-md h-full flex flex-col">
                {product.img_url && (
                  <img
                    src={product.img_url}
                    alt={product.nombre}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                )}
                <div className="p-4 flex flex-col flex-grow">
                  <h5 className="text-xl font-semibold mb-2">{product.nombre}</h5>
                  <p className="text-secondary mb-2 flex-grow">{product.descripcion}</p>
                  <p className="text-secondary text-sm">
                    Categoría: {product.categoria?.name || 'Sin categoría'}
                  </p>
                  {user && user.role === 'cliente' && (
                    <p className="text-text-primary font-bold mt-2">
                      Precio: Bs {product.precio ? parseFloat(product.precio.toFixed(2)) : '0.00'}
                    </p>
                  )}
                </div>
                <div className="p-4 border-t border-secondary">
                  {user ? (
                    user.role === 'cliente' ? (
                      <div className="flex space-x-2">
                        <Link
                          to={`/products/${product._id}`}
                          className="flex-1 py-2 px-4 border border-secondary rounded-md text-secondary hover:bg-background transition duration-300 text-center"
                        >
                          Ver Detalles
                        </Link>
                        <button
                          className={`flex-1 py-2 px-4 rounded-md text-white transition duration-300 ${
                            product.stock > 0
                              ? 'bg-primary hover:opacity-90'
                              : 'bg-secondary cursor-not-allowed'
                          }`}
                          onClick={() => handleAddToCart(product._id)}
                          disabled={product.stock === 0}
                        >
                          Añadir al Carrito
                        </button>
                      </div>
                    ) : null
                  ) : (
                    <button
                      onClick={openLoginModal}
                      className="w-full py-2 px-4 border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition duration-300 text-center"
                    >
                      Inicia sesión para ver precios
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Products;

