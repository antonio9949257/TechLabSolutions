import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api';

const KitDetail = () => {
  const { id } = useParams();
  const [kit, setKit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchKit = async () => {
      try {
        const response = await authenticatedFetch(`/kits/${id}`);
        if (response.ok) {
          const data = await response.json();
          setKit(data);
        } else {
          const errorData = await response.json();
          setError(errorData.message || 'Error al cargar el kit');
        }
      } catch (err) {
        console.error('Error fetching kit:', err);
        setError('Error de conexión al servidor');
      } finally {
        setLoading(false);
      }
    };
    fetchKit();
  }, [id]);

  if (loading) return <div className="container mx-auto px-4 mt-8">Cargando kit...</div>;
  if (error) return <div className="container mx-auto px-4 mt-8 text-red-500">Error: {error}</div>;
  if (!kit) return <div className="container mx-auto px-4 mt-8">Kit no encontrado.</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">{kit.name}</h2>
      {kit.imageUrl && (
        <img src={kit.imageUrl} alt={kit.name} className="w-full h-96 object-cover rounded-lg mb-6" />
      )}
      <p className="text-secondary mb-4">{kit.description}</p>
      <p className="text-text-primary font-bold mt-2">
        Precio: Bs {kit.price ? parseFloat(kit.price.toFixed(2)) : '0.00'}
      </p>
      <h3 className="text-2xl font-bold mt-6 mb-4">Productos en este kit</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kit.products.map(item => (
          <div key={item.productId._id} className="bg-card-bg rounded-lg shadow-md p-4">
            <h4 className="text-xl font-semibold">{item.productId.nombre}</h4>
            <p className="text-secondary">Cantidad: {item.quantity}</p>
            <p className="text-secondary">Precio: Bs {item.priceAtTimeOfAddition.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default KitDetail;
