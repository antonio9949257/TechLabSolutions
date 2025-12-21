import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { publicFetch } from '../utils/api';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await publicFetch(`/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar el producto');
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 mt-8">Cargando producto...</div>;
  if (error) return <div className="container mx-auto px-4 mt-8 text-red-600">Error: {error}</div>;
  if (!product) return <div className="container mx-auto px-4 mt-8">Producto no encontrado.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4 mb-8 md:mb-0">
          <img
            src={product.img_url}
            alt={product.nombre}
            className="w-full h-auto max-h-[500px] object-cover rounded-lg"
          />
        </div>
        <div className="w-full md:w-1/2 px-4">
          <h2 className="text-4xl font-bold mb-4">{product.nombre}</h2>
          <p className="text-gray-600 text-lg mb-2">
            Categoría: {product.categoria?.name || 'Sin categoría'}
          </p>
          <p className="text-gray-700 mb-4">{product.descripcion}</p>

          {user ? (
            <>
              <h3 className="text-2xl font-semibold my-4">
                Precio: Bs {product.precio ? parseFloat(product.precio.toFixed(2)) : '0.00'}
              </h3>
              <p className="text-gray-700 mb-4">
                Stock: {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}
              </p>
              {user.role === 'cliente' && (
                <button
                  className={`py-3 px-6 text-lg rounded-md text-white transition duration-300 ${
                    product.stock > 0 ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                  }`}
                  onClick={() => addToCart(product._id, 1, 'Product')}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                </button>
              )}
            </>
          ) : (
            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative my-4">
              <Link to="/login" className="text-blue-700 hover:underline">
                Inicia sesión
              </Link>{' '}
              para ver precios y comprar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
