import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { publicFetch } from '../utils/api';
import { Link } from 'react-router-dom';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const [results, setResults] = useState({ products: [], services: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const query = searchParams.get('q');

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
  }, [query]);

  if (loading) {
    return <div className="container mt-4"><h4>Buscando...</h4></div>;
  }

  if (error) {
    return <div className="container mt-4"><p className="text-danger">{error}</p></div>;
  }

  if (!query) {
    return <div className="container mt-4"><p>Por favor, ingrese un término de búsqueda.</p></div>;
  }

  const { products, services } = results;

  return (
    <div className="container mt-4">
      <h2>Resultados de la búsqueda para: "{query}"</h2>
      <hr />

      {products.length === 0 && services.length === 0 ? (
        <p>No se encontraron resultados.</p>
      ) : (
        <>
          {products.length > 0 && (
            <section>
              <h3>Productos</h3>
              <div className="row">
                {products.map((product) => (
                  <div key={product._id} className="col-md-4 mb-4">
                    <div className="card h-100">
                      <img src={product.image || 'https://via.placeholder.com/150'} className="card-img-top" alt={product.name} style={{ height: '200px', objectFit: 'cover' }} />
                      <div className="card-body">
                        <h5 className="card-title">{product.name}</h5>
                        <p className="card-text">{product.description}</p>
                        <p className="card-text"><strong>Precio:</strong> ${product.price}</p>
                        <Link to={`/products/${product._id}`} className="btn btn-primary">Ver Detalle</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {services.length > 0 && (
            <section className="mt-5">
              <h3>Servicios</h3>
              <div className="row">
                {services.map((service) => (
                  <div key={service._id} className="col-md-4 mb-4">
                    <div className="card h-100">
                       <img src={service.image || 'https://via.placeholder.com/150'} className="card-img-top" alt={service.name} style={{ height: '200px', objectFit: 'cover' }} />
                      <div className="card-body">
                        <h5 className="card-title">{service.name}</h5>
                        <p className="card-text">{service.description}</p>
                        <Link to={`/services/${service._id}`} className="btn btn-primary">Ver Detalle</Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
