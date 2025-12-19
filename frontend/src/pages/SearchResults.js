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
    <div className="container mx-auto px-4 py-8">
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
                  <div key={product._id} className="bg-white rounded-lg shadow-md h-full flex flex-col">
                    <img src={product.image || 'https://via.placeholder.com/150'} className="w-full h-48 object-cover rounded-t-lg" alt={product.name} />
                    <div className="p-4 flex flex-col flex-grow">
                      <h5 className="text-xl font-semibold mb-2">{product.name}</h5>
                      <p className="text-gray-700 mb-2">{product.description}</p>
                      <p className="text-gray-700"><strong>Precio:</strong> ${product.price}</p>
                      <Link to={`/products/${product._id}`} className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-center mt-auto">Ver Detalle</Link>
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
                        <Link to={`/services/${service._id}`} className="py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300 text-center mt-auto">Ver Detalle</Link>
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
