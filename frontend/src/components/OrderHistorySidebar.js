import React, { useEffect, useState } from 'react';
import { XCircle } from 'react-bootstrap-icons';
import { useAuth } from '../context/AuthContext';
import { authenticatedFetch } from '../utils/api';
import OrderHistory from './OrderHistory'; // Import the modified OrderHistory component

const OrderHistorySidebar = ({ isOpen, onClose }) => {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen || !token) {
      // Only fetch if the sidebar is open and user is authenticated
      setOrders([]); // Clear previous orders when closing
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
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
    };

    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear previous errors
    fetchOrders();
  }, [isOpen, token]); // Re-fetch when sidebar opens or token changes

  return (
    <div
      className={`fixed top-0 right-0 h-full w-80 bg-gray-900 backdrop-blur-sm bg-opacity-70 shadow-lg z-notification transform transition-transform duration-300 ease-in-out flex flex-col ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <h3 className="text-xl font-semibold text-text-primary">Historial de Pedidos</h3>
        <button onClick={onClose} className="text-secondary hover:text-primary">
          <XCircle className="w-7 h-7" />
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading ? (
          <p className="text-text-primary">Cargando historial de pedidos...</p>
        ) : error ? (
          <p className="text-red-600">Error: {error}</p>
        ) : orders.length === 0 ? (
          <p className="text-text-primary">No tienes pedidos anteriores.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order._id} className="bg-gray-800 p-6 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-4 border-b pb-3 border-gray-700">
                  <h3 className="text-xl font-semibold text-text-primary">Pedido ID: {order._id}</h3>
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    order.status === 'completado' ? 'bg-green-200 text-green-800' :
                    order.status === 'pendiente' ? 'bg-yellow-200 text-yellow-800' :
                    'bg-gray-200 text-gray-800'
                  }`}>
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-300 mb-2">Fecha: {new Date(order.createdAt).toLocaleDateString()} {new Date(order.createdAt).toLocaleTimeString()}</p>
                <p className="text-gray-300 mb-4">Total: ${order.totalPrice.toFixed(2)}</p>

                <div className="mt-4">
                  <h4 className="text-lg font-semibold mb-2 text-text-primary">Artículos:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-400">
                    {order.orderItems.map((item, index) => (
                      <li key={index}>
                        {item.name} (x{item.qty}) - ${item.price.toFixed(2)} cada uno
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistorySidebar;
