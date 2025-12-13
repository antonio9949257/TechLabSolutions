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
            name: item.product.nombre,
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
      <div className="container mt-5">
        <h2>Checkout</h2>
        <p>Tu carrito está vacío. No puedes proceder al pago.</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2>Resumen del Pedido</h2>
      <div className="card">
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th scope="col">Nombre del Producto</th>
                <th scope="col" className="text-center">Cantidad</th>
                <th scope="col" className="text-end">Precio Unitario</th>
                <th scope="col" className="text-end">Total</th>
              </tr>
            </thead>
            <tbody>
              {cart.items.map((item) => (
                <tr key={item.product._id}>
                  <td>{item.product.nombre}</td>
                  <td className="text-center">{item.quantity}</td>
                  <td className="text-end">Bs {parseFloat(item.price.toFixed(2))}</td>
                  <td className="text-end">Bs {parseFloat((item.price * item.quantity).toFixed(2))}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3" className="text-end fw-bold">Total General</td>
                <td className="text-end fw-bold">Bs {parseFloat(cart.totalPrice.toFixed(2))}</td>
              </tr>
            </tfoot>
          </table>
          <button className="btn btn-success w-100 mt-3" onClick={handleCreateOrder}>
            Confirmar y Pagar (Simulado)
          </button>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
