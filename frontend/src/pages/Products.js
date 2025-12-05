import React, { useEffect, useState } from 'react';
import { authenticatedFetch } from '../utils/api'; // Assuming authenticatedFetch can be used for public routes too

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // The /products route is public, so authenticatedFetch will work even without a token
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
              <div className="card h-100">
                {product.image && (
                  <img
                    src={product.image}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                )}
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="card-text">{product.description}</p>
                  <p className="card-text">
                    <strong>Precio: ${product.price.toFixed(2)}</strong>
                  </p>
                  <p className="card-text">
                    <small className="text-muted">Categoría: {product.category}</small>
                  </p>
                </div>
                <div className="card-footer">
                  {/* Add to cart button or more details link */}
                  <button className="btn btn-primary">Añadir al Carrito</button>
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