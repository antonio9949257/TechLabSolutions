import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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

// Mapping from display category names to backend category names
const categoryMap = {
  'Cámaras de Seguridad': 'Cámaras CCTV',
  'Cámaras IP': 'Cámaras CCTV',
  'Cámaras WiFi': 'Cámaras CCTV',
  'Cámaras PTZ': 'Cámaras CCTV',
  'Kits de Vigilancia': 'Kits de Vigilancia',
  'DVR / NVR': 'Grabadores CCTV',
  'Alarmas': 'Alarmas',
  'Sensores de Movimiento': 'Sensores de Movimiento',
  'Video Porteros': 'Video Porteros',
  'Control de Acceso': 'Control de Acceso',
  'Accesorios': 'Accesorios CCTV',
};

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const { addToCart, clearCart } = useCart();
  const { user, openLoginModal } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const category = params.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [location.search]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const backendCategoryName = categoryMap[selectedCategory] || selectedCategory;
        const categoryParam = selectedCategory !== 'Todos' ? `?category=${encodeURIComponent(backendCategoryName)}` : '';
        const response = await authenticatedFetch(`/products${categoryParam}`);
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
  }, [selectedCategory]); // Re-fetch when selectedCategory changes

  const handleAddToCart = (productId, isKit) => {
    addToCart(productId, 1, isKit ? 'Kit' : 'Product');
  };

  const handleBuyNow = async (productId, isKit) => {
    if (isKit) {
      const confirmClear = window.confirm(
        'Al comprar este kit, tu carrito actual será vaciado y se llenará con los productos de este kit. ¿Deseas continuar?'
      );

      if (!confirmClear) {
        return; // User cancelled
      }

      try {
        console.log('handleBuyNow: Fetching kit details for', productId);
        const response = await authenticatedFetch(`/kits/${productId}`);
        if (!response.ok) {
          throw new Error('Kit no encontrado');
        }
        const kit = await response.json();
        console.log('handleBuyNow: Kit details fetched', kit);

        console.log('handleBuyNow: Clearing cart');
        await clearCart();
        console.log('handleBuyNow: Cart cleared');

        console.log('handleBuyNow: Adding kit products to cart');
        for (const item of kit.products) {
          await addToCart(item.productId._id, item.quantity, 'Product');
          console.log(`handleBuyNow: Added product ${item.productId.nombre} (x${item.quantity})`);
        }
        console.log('handleBuyNow: All kit products added');

        // Store kit prices in localStorage
        localStorage.setItem('kitTotalPriceBeforeDiscount', kit.totalPriceBeforeDiscount);
        localStorage.setItem('kitFinalPrice', kit.finalPrice);
        console.log('handleBuyNow: Kit prices stored in localStorage');

        // 4. Navigate to checkout
        navigate('/checkout');
      } catch (error) {
        console.error('Error in handleBuyNow:', error);
      }
    } else {
      // Clear any previous kit price data from localStorage
      localStorage.removeItem('kitTotalPriceBeforeDiscount');
      localStorage.removeItem('kitFinalPrice');
      console.log('handleBuyNow: Cleared kit prices from localStorage for non-kit purchase');
      await addToCart(productId, 1, 'Product');
      navigate('/checkout');
    }
  };

  // Frontend filtering is no longer needed as it's done on the backend
  // const filterProducts = (products, category) => { ... };

  // const filteredProducts = filterProducts(products, selectedCategory); // No longer needed

  if (loading) return <div className="container mx-auto px-4 mt-8">Cargando productos...</div>;
  if (error) return <div className="container mx-auto px-4 mt-8 text-red-500">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8 flex">
      {/* Category Sidebar */}
      <aside className="w-1/4 pr-8 sticky-sidebar">
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
        {products.length === 0 ? (
          <p className="text-secondary">No hay productos disponibles en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
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
                  {product.isKit && product.products && (
                    <div className="mb-2">
                      <p className="text-sm font-semibold">Incluye:</p>
                      <ul className="list-disc list-inside text-sm text-secondary">
                        {product.products.map((item, index) => (
                          <li key={index}>{item.nombre} (x{item.quantity})</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <p className="text-secondary text-sm">
                    Categoría: {product.categoria?.name || 'Sin categoría'}
                  </p>
                  {(user && (user.role === 'cliente' || user.role === 'admin')) && (
                    <>
                      {product.isKit && product.totalPriceBeforeDiscount && (
                        <p className="text-text-primary text-sm mt-2">
                          Precio Total (sin desc.): Bs {product.totalPriceBeforeDiscount.toFixed(2)}
                        </p>
                      )}
                      <p className="text-text-primary font-bold mt-2">
                        Precio: Bs {product.finalPrice ? product.finalPrice.toFixed(2) : (product.precio ? parseFloat(product.precio.toFixed(2)) : '0.00')}
                      </p>
                    </>
                  )}
                </div>
                <div className="p-4 border-t border-secondary">
                  {user ? (
                    (user.role === 'cliente' || user.role === 'admin') ? (
                      <div className="flex space-x-2">
                        <Link
                          to={product.isKit ? `/kits/${product._id}` : `/products/${product._id}`}
                          className="flex-1 py-2 px-4 border border-secondary rounded-md text-secondary hover:bg-background transition duration-300 text-center"
                        >
                          Ver Detalles
                        </Link>
                        {product.isKit ? (
                          <button
                            className="flex-1 py-2 px-4 rounded-md text-white bg-primary hover:opacity-90 transition duration-300"
                            onClick={() => handleBuyNow(product._id, product.isKit)}
                          >
                            Comprar
                          </button>
                        ) : (
                          <button
                            className={`flex-1 py-2 px-4 rounded-md text-white transition duration-300 ${
                              (product.stock > 0 || product.isKit)
                                ? 'bg-primary hover:opacity-90'
                                : 'bg-secondary cursor-not-allowed'
                            }`}
                            onClick={() => handleAddToCart(product._id, product.isKit)}
                            disabled={!product.isKit && product.stock === 0}
                          >
                            Añadir al Carrito
                          </button>
                        )}
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

