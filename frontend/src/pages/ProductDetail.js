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

  if (loading) {
    return <div className="container mt-5">Cargando producto...</div>;
  }

  if (error) {
    return <div className="container mt-5 text-danger">Error: {error}</div>;
  }

  if (!product) {
    return <div className="container mt-5">Producto no encontrado.</div>;
  }

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-md-6">
          <img
            src={product.image}
            alt={product.name}
            className="img-fluid rounded"
            style={{ maxHeight: '500px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-6">
          <h2>{product.name}</h2>
          <p className="text-muted">Categoría: {product.category}</p>
          <p>{product.description}</p>
          {user ? (
            <>
              <h3 className="my-3">Precio: ${product.price.toFixed(2)}</h3>
              <p>Stock: {product.stock > 0 ? `${product.stock} disponibles` : 'Agotado'}</p>
              {user.role === 'cliente' && (
                <button
                  className="btn btn-primary btn-lg"
                  onClick={() => addToCart(product._id, 1)}
                  disabled={product.stock === 0}
                >
                  {product.stock > 0 ? 'Añadir al Carrito' : 'Agotado'}
                </button>
              )}
            </>
          ) : (
            <div className="alert alert-info">
              <Link to="/login">Inicia sesión</Link> para ver precios y comprar.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
