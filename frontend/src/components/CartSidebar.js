import React, { useMemo } from 'react';
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

  const handleQuantityChange = (itemId, quantity) => {
    const newQuantity = parseInt(quantity, 10);
    if (newQuantity > 0) {
      updateCartItem(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  const handleViewItems = () => {
    closeCart();
    navigate('/products');
  };

  const cartContents = useMemo(() => {
    if (!cart || !cart.items) return { hasProducts: false, hasServices: false };

    let productsFound = false;
    let servicesFound = false;

    for (const item of cart.items) {
      // If item.itemType is explicitly 'Product'
      if (item.itemType === 'Product') {
        productsFound = true;
      }
      // If item.itemType is explicitly 'Service'
      else if (item.itemType === 'Service') {
        servicesFound = true;
      }
      // If item.itemType is missing (undefined or null), assume it's an old Product
      else if (item.itemType === undefined || item.itemType === null) {
        productsFound = true;
      }
    }
    return { hasProducts: productsFound, hasServices: servicesFound };
  }, [cart]);

  const renderFooter = () => {
    const { hasProducts, hasServices } = cartContents;

    console.log('Cart Contents:', cartContents); // Debug log
    console.log('hasProducts:', hasProducts, 'hasServices:', hasServices); // Debug log
        console.log('Cart items length for button rendering:', cart.items.length); // New debug log

        return (
          <div className="pt-4 border-t">
            <h4 className="text-lg font-bold mb-3">
              Total: Bs {cart.totalPrice.toFixed(2)}
            </h4>

            {cart.items.length > 0 && (
              <button
                onClick={handleCheckout}
                className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 transition"
              >
                Proceder al Pago
              </button>
            )}
          </div>
        );
      };

  return (
    <>
      <div
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
                      <input
                        type="number"
                        min="1"
                        value={cartItem.quantity}
                        onChange={(e) =>
                          handleQuantityChange(
                            cartItem.item._id,
                            e.target.value
                          )
                        }
                        className="w-16 px-2 py-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />

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
              {renderFooter()}
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
      </div>
    </>
  );
};

export default CartSidebar;
