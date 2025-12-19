import React, { useRef } from 'react';
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
          className="fixed inset-0 bg-black/50 z-40"
          onClick={closeCart}
        />
      )}

      <div
        ref={offcanvasRef}
        className={`
          fixed top-0 right-0 w-80 h-full bg-card-bg shadow-lg z-50
          transform transition-transform duration-300 ease-in-out
          ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}
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

        {/* Body */}
        <div className="flex flex-col h-full p-4 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center flex-grow">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            </div>
          ) : cart && cart.items.length > 0 ? (
            <>
              <ul className="flex-grow divide-y">
                {cart.items.map((item) => (
                  <li key={item.product._id} className="py-4">
                    <div className="flex justify-between">
                      <div>
                        <h6 className="font-medium">
                          {item.product.nombre}
                        </h6>
                        <p className="text-sm text-secondary">
                          Cantidad: {item.quantity}
                        </p>
                      </div>
                      <span className="text-secondary">
                        Bs {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.product._id,
                            e.target.value
                          )
                        }
                        className="
                          w-16 px-2 py-1 text-sm border rounded
                          focus:outline-none focus:ring-2 focus:ring-primary
                        "
                      />

                      <button
                        onClick={() =>
                          removeFromCart(item.product._id)
                        }
                        className="
                          px-2 py-1 text-red-500 border border-red-500 rounded
                          hover:bg-red-500 hover:text-white transition
                        "
                      >
                        <Trash />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Footer */}
              <div className="pt-4 border-t">
                <h4 className="text-lg font-bold mb-3">
                  Total: Bs {cart.totalPrice.toFixed(2)}
                </h4>

                <button
                  onClick={handleCheckout}
                  className="
                    w-full bg-green-500 text-white py-2 rounded
                    hover:bg-green-600 transition
                  "
                >
                  Proceder al Pago
                </button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center flex-grow text-center">
              <p className="text-secondary mb-4">
                Tu carrito está vacío
              </p>
              <button
                onClick={handleViewProducts}
                className="
                  bg-primary text-white px-4 py-2 rounded
                  hover:opacity-90 transition
                "
              >
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
