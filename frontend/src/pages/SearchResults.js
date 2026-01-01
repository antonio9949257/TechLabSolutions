import React, { useState, useEffect } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom'; // Add useNavigate
import { publicFetch, authenticatedFetch } from '../utils/api'; // Add authenticatedFetch
import { useCart } from '../context/CartContext'; // Import useCart
import { useAuth } from '../context/AuthContext'; // Import useAuth

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate(); // Initialize useNavigate
  const { addToCart, clearCart } = useCart(); // Initialize useCart
  const { user, openLoginModal } = useAuth(); // Initialize useAuth

  const [results, setResults] = useState({ products: [], services: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = searchParams.get('q');

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
        const response = await authenticatedFetch(`/kits/${productId}`);
        if (!response.ok) {
          throw new Error('Kit no encontrado');
        }
        const kit = await response.json();

        await clearCart();

        for (const item of kit.products) {
          await addToCart(item.productId._id, item.quantity, 'Product');
        }

        // Store kit prices in localStorage
        localStorage.setItem('kitTotalPriceBeforeDiscount', kit.totalPriceBeforeDiscount);
        localStorage.setItem('kitFinalPrice', kit.finalPrice);

        // Navigate to checkout
        navigate('/checkout');
      } catch (error) {
        console.error('Error in handleBuyNow:', error);
      }
    } else {
      // Clear any previous kit price data from localStorage
      localStorage.removeItem('kitTotalPriceBeforeDiscount');
      localStorage.removeItem('kitFinalPrice');
      await addToCart(productId, 1, 'Product');
      navigate('/checkout');
    }
  };

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await publicFetch(`/search?q=${encodeURIComponent(query)}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError('Error al cargar los resultados de la búsqueda.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query]); // Removed selectedCategory, searchParams, navigate from dependencies

  if (loading) {
    return <div className="container mx-auto px-4 mt-8"><h4 className="text-xl font-semibold">Buscando...</h4></div>;
  }

  if (error) {
    return <div className="container mx-auto px-4 mt-8"><p className="text-red-600">{error}</p></div>;
  }

  if (!query) {
    return <div className="container mx-auto px-4 mt-8"><p className="text-gray-600">Por favor, ingrese un término de búsqueda.</p></div>;
  }

  const { products, services } = results;

  return (
    <div className="container mx-auto px-4 py-8"> {/* Removed flex */}
      <main className="w-full"> {/* Changed to w-full */}
        <h2 className="text-3xl font-bold mb-4">Resultados de la búsqueda para: "{query}"</h2>
        <hr className="border-t border-gray-300 my-4" />

        {products.length === 0 && services.length === 0 ? (
          <p className="text-gray-600">No se encontraron resultados.</p>
        ) : (
          <>
            {products.length > 0 && (
              <section className="mb-8">
                <h3 className="text-2xl font-bold mb-4">Productos</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {products.map((product) => (
                    <div key={product._id} className="bg-card-bg rounded-lg shadow-md h-full flex flex-col">
                      <img src={product.img_url || 'https://via.placeholder.com/150'} className="w-full h-48 object-cover rounded-t-lg" alt={product.nombre} />
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
                          Categoría: {product.categoria?.name || 'N/A'}
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
              </section>
            )}

            {services.length > 0 && (
              <section className="mt-8">
                <h3 className="text-2xl font-bold mb-4">Servicios</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service) => (
                    <div key={service._id} className="bg-white rounded-lg shadow-md h-full flex flex-col">
                        <img src={service.image || 'https://via.placeholder.com/150'} className="w-full h-48 object-cover rounded-t-lg" alt={service.name} />
                        <div className="p-4 flex flex-col flex-grow">
                          <h5 className="text-xl font-semibold mb-2">{service.name}</h5>
                          <p className="text-gray-700 mb-2">{service.description}</p>
                          <p className="text-gray-700"><strong>Categoría:</strong> {service.category}</p> {/* Assuming service has a 'category' field */}
                          <p className="text-gray-700"><strong>Precio:</strong> Bs {service.price ? service.price.toFixed(2) : 'N/A'}</p> {/* Assuming service has a 'price' field */}
                          <Link to={`/services/${service._id}`} className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-center mt-auto">Ver Detalle</Link>
                        </div>
                      </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default SearchResults;
