import React from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import { Trash } from 'react-bootstrap-icons';

const CartSidebar = () => {
  const {
    cart,
    loading,
    removeFromCart,
    updateCartItem,
    isCartOpen,
    closeCart,
  } = useCart();

  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    const quantity = Math.max(1, Number(newQuantity));
    updateCartItem(itemId, quantity);
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewItems = () => {
    closeCart();
    navigate('/products');
  };

  return (
    <>
      <div
        className={`
          fixed top-0 right-0 w-80 h-full bg-card-bg shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
          flex flex-col // Added flexbox for column layout
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h5 className="text-xl font-semibold">Tu Carrito</h5>
          <button
            onClick={closeCart}
            className="text-secondary hover:text-primary"
          >
            ✕
          </button>
        </div>

        {/* Body - now the scrollable part */}
        <div className="flex-1 overflow-y-auto p-4"> {/* flex-1 to take available space, overflow-y-auto for scrolling */}
          {loading ? (
            <div className="flex items-center justify-center flex-grow">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : cart && cart.items.length > 0 ? (
            <>
              <ul className="divide-y"> {/* Removed flex-grow from ul */}
                {cart.items.map((cartItem) => (
                  <li key={cartItem.item._id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <h6 className="font-medium">
                          {cartItem.item.nombre || cartItem.item.name}
                        </h6>
                        <p className="text-sm text-secondary">
                          Cantidad: {cartItem.quantity}
                        </p>
                      </div>
                      <span className="text-secondary">
                        Bs {(cartItem.price * cartItem.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() =>
                          handleQuantityChange(cartItem.item._id, cartItem.quantity - 1)
                        }
                        disabled={cartItem.quantity <= 1}
                        className="w-8 h-8 flex items-center justify-center border rounded disabled:opacity-50 transition-all duration-150 ease-in-out"
                      >
                        −
                      </button>

                      <span className="min-w-[24px] text-center">
                        {cartItem.quantity}
                      </span>

                      <button
                        onClick={() =>
                          handleQuantityChange(cartItem.item._id, cartItem.quantity + 1)
                        }
                        className="w-8 h-8 flex items-center justify-center border rounded transition-all duration-150 ease-in-out"
                      >
                        +
                      </button>

                      <button
                        onClick={() => removeFromCart(cartItem.item._id)}
                        className="px-2 py-1 text-red-500 border border-red-500 rounded hover:bg-red-500 hover:text-white transition"
                      >
                        <Trash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow text-center">
              <p className="text-secondary mb-4">
                Tu carrito está vacío
              </p>
              <button
                onClick={handleViewItems}
                className="bg-primary text-white px-4 py-2 rounded hover:opacity-90 transition"
              >
                Ver Productos y Servicios
              </button>
            </div>
          )}
        </div>

        {/* Footer - now sticky at the bottom */}
        {cart && cart.items.length > 0 && ( // Only render footer if cart has items
          <div className="sticky bottom-0 z-50 bg-card-bg p-4 border-t"> {/* Added sticky, z-index, background, padding, and top border */}
            <h4 className="text-lg font-bold mb-3">
              Total: Bs {cart.totalPrice.toFixed(2)}
            </h4>

            <button
              onClick={handleCheckout}
              className="w-full bg-primary text-white py-2 rounded hover:opacity-90 transition"
            >
              Proceder al Pago
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;
