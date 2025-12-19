import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

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
    addToCart(productId, 1);
  };

  if (loading) return <div className="container mx-auto px-4 mt-8">Cargando productos...</div>;
  if (error) return <div className="container mx-auto px-4 mt-8 text-red-600">Error: {error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Nuestros Productos</h2>
      {products.length === 0 ? (
        <p className="text-gray-600">No hay productos disponibles en este momento.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white rounded-lg shadow-md h-full flex flex-col">
              {product.img_url && (
                <img
                  src={product.img_url}
                  alt={product.nombre}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-4 flex flex-col flex-grow">
                <h5 className="text-xl font-semibold mb-2">{product.nombre}</h5>
                <p className="text-gray-700 mb-2 flex-grow">{product.descripcion}</p>
                <p className="text-gray-500 text-sm">
                  Categoría: {product.categoria?.name || 'Sin categoría'}
                </p>
                {user && user.role === 'cliente' && (
                  <p className="text-gray-800 font-bold mt-2">
                    Precio: Bs {product.precio ? parseFloat(product.precio.toFixed(2)) : '0.00'}
                  </p>
                )}
              </div>
              <div className="p-4 border-t border-gray-200">
                {user ? (
                  user.role === 'cliente' ? (
                    <div className="flex space-x-2">
                      <Link
                        to={`/products/${product._id}`}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition duration-300 text-center"
                      >
                        Ver Detalles
                      </Link>
                      <button
                        className={`flex-1 py-2 px-4 rounded-md text-white transition duration-300 ${
                          product.stock > 0
                            ? 'bg-blue-600 hover:bg-blue-700'
                            : 'bg-gray-400 cursor-not-allowed'
                        }`}
                        onClick={() => handleAddToCart(product._id)}
                        disabled={product.stock === 0}
                      >
                        Añadir al Carrito
                      </button>
                    </div>
                  ) : null
                ) : (
                  <Link
                    to="/login"
                    className="w-full py-2 px-4 border border-blue-600 text-blue-600 rounded-md hover:bg-blue-600 hover:text-white transition duration-300 text-center"
                  >
                    Inicia sesión para ver precios
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;
