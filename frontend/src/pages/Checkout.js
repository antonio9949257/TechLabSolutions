import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { authenticatedFetch } from '../utils/api';

const Checkout = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const handleCreateOrder = async () => {
    try {
      const response = await authenticatedFetch('/orders', {
        method: 'POST',
        body: JSON.stringify({
          orderItems: cart.items.map(item => ({
            product: item.product._id,
            name: item.product.name,
            qty: item.quantity,
            price: item.price,
          })),
          totalPrice: cart.totalPrice,
        }),
      });

      if (response.ok) {
        alert('¡Pedido realizado con éxito!');
        fetchCart(); // To clear the cart in the UI
        navigate('/dashboard'); // Redirect to dashboard or an order confirmation page
      } else {
        const errorData = await response.json();
        alert(`Error al crear el pedido: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error de conexión al crear el pedido.');
    }
  };

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Checkout</h2>
        <p className="text-gray-600">Tu carrito está vacío. No puedes proceder al pago.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Resumen del Pedido</h2>
      <div className="bg-white rounded-lg shadow-md p-6">
          <table className="w-full border-collapse">
            <thead className="bg-gray-200 text-gray-700">
              <tr>
                <th className="py-3 px-4 text-left font-semibold">Nombre del Producto</th>
                <th className="py-3 px-4 text-center font-semibold">Cantidad</th>
                <th className="py-3 px-4 text-right font-semibold">Precio Unitario</th>
                <th className="py-3 px-4 text-right font-semibold">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.product._id} className="border-b border-gray-200">
                  <td className="py-3 px-4">{item.product.name}</td>
                  <td className="py-3 px-4 text-center">{item.quantity}</td>
                  <td className="py-3 px-4 text-right">${item.price.toFixed(2)}</td>
                  <td className="py-3 px-4 text-right">${(item.price * item.quantity).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-gray-300">
                <td colSpan="3" className="py-3 px-4 text-right font-bold">Total General</td>
                <td className="py-3 px-4 text-right font-bold">${cart.totalPrice.toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300 mt-6" onClick={handleCreateOrder}>
            Confirmar y Pagar (Simulado)
          </button>
      </div>
    </div>
  );
};

export default Checkout;
