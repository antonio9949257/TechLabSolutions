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
          orderItems: cart.items.map(cartItem => ({
            product: cartItem.item?._id,
            name: cartItem.item?.nombre || cartItem.item?.name || 'Producto Desconocido',
            qty: cartItem.quantity,
            price: cartItem.price,
          })),
          totalPrice: cart.totalPrice,
        }),
      });

      if (response.ok) {
        alert('¡Pedido realizado con éxito!');
        fetchCart();
        navigate('/dashboard');
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
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-4">Checkout</h2>
        <p className="text-gray-600">
          Tu carrito está vacío. No puedes proceder al pago.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Resumen del Pedido</h2>

      <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-3 px-4 text-left">Producto</th>
              <th className="py-3 px-4 text-center">Cantidad</th>
              <th className="py-3 px-4 text-right">Precio Unitario</th>
              <th className="py-3 px-4 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {cart.items.map(cartItem => (
              <tr
                key={cartItem.item?._id || `cart-item-${cartItem.itemType}-${cartItem.quantity}`}
                className="border-b last:border-b-0"
              >
                <td className="py-3 px-4">
                  {cartItem.item?.nombre || cartItem.item?.name || 'Producto Desconocido'}
                </td>
                <td className="py-3 px-4 text-center">
                  {cartItem.quantity}
                </td>
                <td className="py-3 px-4 text-right">
                  Bs {parseFloat(cartItem.price.toFixed(2))}
                </td>
                <td className="py-3 px-4 text-right font-medium">
                  Bs {parseFloat(
                    (cartItem.price * cartItem.quantity).toFixed(2)
                  )}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr className="border-t-2">
              <td
                colSpan="3"
                className="py-4 px-4 text-right font-bold"
              >
                Total General
              </td>
              <td className="py-4 px-4 text-right font-bold">
                Bs {parseFloat(cart.totalPrice.toFixed(2))}
              </td>
            </tr>
          </tfoot>
        </table>

        <button
          onClick={handleCreateOrder}
          className="
            mt-6 w-full bg-green-600 text-white py-3 rounded
            hover:bg-green-700 transition
          "
        >
          Confirmar y Pagar (Simulado)
        </button>
      </div>
    </div>
  );
};

export default Checkout;

