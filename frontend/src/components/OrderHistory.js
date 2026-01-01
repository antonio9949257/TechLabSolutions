import React, { useEffect, useState } from 'react';
import { authenticatedFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const OrderHistory = () => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (token) {
        try {
          const response = await authenticatedFetch('/orders/myorders');
          if (response.ok) {
            const data = await response.json();
            setOrders(data);
          } else {
            const errorData = await response.json();
            setError(errorData.message || 'Error al cargar el historial de pedidos');
          }
        } catch (err) {
          console.error('Error fetching order history:', err);
          setError('Error de conexión al servidor');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        setError('No autenticado.');
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) {
    return <p className="text-text-primary">Cargando historial de pedidos...</p>;
  }

  if (error) {
    return <p className="text-red-600">Error: {error}</p>;
  }

  return (
    <div className="space-y-6">
      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No tienes pedidos anteriores.</p>
      ) : (
        orders.map((order) => (
          <div key={order._id} className="bg-gray-100 p-6 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-300">
              <h3 className="text-xl font-semibold text-text-primary">Pedido ID: {order._id}</h3>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                order.status === 'completado' ? 'bg-green-200 text-green-800' :
                order.status === 'pendiente' ? 'bg-yellow-200 text-yellow-800' :
                'bg-gray-200 text-gray-800'
              }`}>
                {order.status}
              </span>
            </div>
            <p className="text-gray-700 mb-2">Fecha: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
            <p className="text-gray-700 mb-4">Total: ${order.totalPrice.toFixed(2)}</p>

            <div className="mt-4">
              <h4 className="text-lg font-semibold mb-2 text-text-primary">Artículos:</h4>
              <ul className="list-disc list-inside space-y-1">
                {order.orderItems.map((item, index) => (
                  <li key={index} className="text-gray-600">
                    {item.name} (x{item.qty}) - ${item.price.toFixed(2)} cada uno
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
