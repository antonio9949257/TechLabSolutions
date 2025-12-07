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
    addToCart(productId, 1); // Add 1 unit by default
  };

  if (loading) {
    return <div className="container mt-5">Cargando productos...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Nuestros Productos</h2>
      {products.length === 0 ? (
        <p>No hay productos disponibles en este momento.</p>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {products.map((product) => (
            <div className="col" key={product._id}>
              <div className="card h-100 d-flex flex-column">
                {product.image && (
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text flex-grow-1">{product.description}</p>
                  <p className="card-text">
                    <small className="text-muted">Categoría: {product.category}</small>
                  </p>
                  {user ? (
                    <p className="card-text">
                      <strong>Precio: ${product.price.toFixed(2)}</strong>
                    </p>
                  ) : null}
                </div>
                <div className="card-footer">
                  {user ? (
                    user.role === 'cliente' && (
                      <div className="d-flex gap-2">
                        <Link to={`/products/${product._id}`} className="btn btn-outline-secondary flex-grow-1">
                          Ver Detalles
                        </Link>
                        <button
                          className="btn btn-primary flex-grow-1"
                          onClick={() => handleAddToCart(product._id)}
                        >
                          Añadir al Carrito
                        </button>
                      </div>
                    )
                  ) : (
                    <div className="text-center">
                      <Link to="/login" className="btn btn-outline-primary w-100">
                        Inicia sesión para ver precios
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;