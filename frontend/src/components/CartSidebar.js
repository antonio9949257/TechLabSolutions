import React, { useRef } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'react-bootstrap-icons';

const CartSidebar = () => {
  const { cart, loading, removeFromCart, updateCartItem, isCartOpen, closeCart } = useCart();
  const offcanvasRef = useRef(null);
  const navigate = useNavigate();

  const handleQuantityChange = (productId, quantity) => {
    const newQuantity = parseInt(quantity, 10);
    if (newQuantity > 0) {
      updateCartItem(productId, newQuantity);
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewProducts = () => {
    closeCart();
    navigate('/products');
  };

  return (
    <>
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={closeCart}
        ></div>
      )}
      <div
        className={`fixed top-0 right-0 w-80 h-full bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-50
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}
        tabIndex="-1"
        aria-labelledby="cartSidebarLabel"
        ref={offcanvasRef}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h5 className="text-xl font-semibold" id="cartSidebarLabel">
            Tu Carrito
          </h5>
          <button
            type="button"
            className="text-gray-400 hover:text-gray-600"
            aria-label="Close"
            onClick={closeCart}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="p-4 overflow-y-auto flex-grow flex flex-col">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500">
                <span className="sr-only">Cargando...</span>
              </div>
            </div>
          ) : cart && cart.items.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-200 flex-grow">
                {cart.items.map((item) => (
                  <li key={item.product._id} className="py-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h6 className="text-lg font-medium">{item.product.name}</h6>
                        <small className="text-gray-500">Cantidad: {item.quantity}</small>
                      </div>
                      <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                    <div className="flex items-center mt-2">
                      <input
                        type="number"
                        className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-sm"
                        value={item.quantity}
                        onChange={(e) => handleQuantityChange(item.product._id, e.target.value)}
                        min="1"
                      />
                      <button
                        className="ml-2 px-2 py-1 border border-red-500 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition duration-300 text-sm"
                        onClick={() => removeFromCart(item.product._id)}
                      >
                        <Trash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className="mt-4 p-4 border-t border-gray-200">
                <h4 className="text-xl font-bold mb-4">Total: ${cart.totalPrice.toFixed(2)}</h4>
                <button onClick={handleCheckout} className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition duration-300">
                  Proceder al Pago
                </button>
              </div>
            </>
          ) : (
            <div className="text-center p-4">
              <p className="text-gray-600 mb-4">Tu carrito está vacío.</p>
              <button onClick={handleViewProducts} className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300">
                Ver Productos
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default CartSidebar;
